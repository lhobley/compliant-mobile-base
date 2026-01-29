import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera } from 'lucide-react-native'; // Requires lucide-react-native or use generic Icon
import * as ImagePicker from 'expo-image-picker';
import { MasterItem, InventoryLine } from '../../types/inventory';
import { saveInventoryLine } from '../../lib/inventoryService';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { analyzeAlcoholPhoto, mapDetectionsToItems } from '../../lib/aiService';

const LOCATION_ID = 'loc_main_bar';

export const CategoryDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { sessionId, categoryId, categoryName } = route.params;

  const [items, setItems] = useState<MasterItem[]>([]);
  const [counts, setCounts] = useState<Record<string, string>>({}); // local text input state
  const [lines, setLines] = useState<Record<string, InventoryLine>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Master Items for Category
      const itemsQ = query(
        collection(db, 'items'),
        where('categoryId', '==', categoryId)
      );
      const itemsSnap = await getDocs(itemsQ);
      const fetchedItems: MasterItem[] = itemsSnap.docs.map(d => d.data() as MasterItem)
        .sort((a,b) => a.templateIndex - b.templateIndex);
      
      setItems(fetchedItems);

      // 2. Fetch Existing Counts (Lines)
      const linesQ = query(
        collection(db, 'inventorySessions', sessionId, 'lines'),
        where('categoryId', '==', categoryId)
      );
      const linesSnap = await getDocs(linesQ);
      const fetchedLines: Record<string, InventoryLine> = {};
      const initialCounts: Record<string, string> = {};

      linesSnap.docs.forEach(d => {
        const line = d.data() as InventoryLine;
        fetchedLines[line.itemId] = line;
        initialCounts[line.itemId] = line.countedBottles.toString();
      });

      setLines(fetchedLines);
      setCounts(initialCounts);

    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCount = async (item: MasterItem, text: string) => {
    const val = parseFloat(text);
    if (isNaN(val)) return;

    // Optimistic Update
    setCounts(prev => ({ ...prev, [item.id]: text }));
    
    // Fire and forget save
    try {
      await saveInventoryLine(sessionId, LOCATION_ID, item, val);
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const takePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission needed", "Camera access is required for AI inventory.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: true, // For demo, or upload uri
    });

    if (!result.canceled && result.assets[0]) {
      // Navigate to Review Screen
      navigation.navigate('PhotoReview', {
        photoUri: result.assets[0].uri,
        sessionId,
        locationId: LOCATION_ID,
        categoryId, // Context for mapping
        items // Pass master items for matching
      });
    }
  };

  const renderItem = ({ item }: { item: MasterItem }) => {
    const currentCount = counts[item.id] || '';
    
    return (
      <View style={styles.row}>
        <View style={styles.itemInfo}>
          <Text style={styles.code}>{item.templateCode}</Text>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.details}>{item.sizeMl}ml • Par: {item.defaultPar}</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={currentCount}
            onChangeText={(text) => setCounts(prev => ({...prev, [item.id]: text}))}
            onEndEditing={(e) => handleSaveCount(item, e.nativeEvent.text)}
            placeholder="0"
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{categoryName}</Text>
        <TouchableOpacity onPress={takePhoto} style={styles.camBtn}>
          <Text style={styles.camText}>📷 AI Scan</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold' },
  backBtn: { padding: 5 },
  backText: { fontSize: 16, color: '#3B82F6' },
  camBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  camText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  list: { paddingBottom: 40 },
  row: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', alignItems: 'center' },
  itemInfo: { flex: 1 },
  code: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
  itemName: { fontSize: 16, fontWeight: '500', color: '#111827' },
  details: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  inputContainer: { width: 80 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, fontSize: 18, textAlign: 'center', color: '#111827' }
});
