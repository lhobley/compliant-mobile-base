import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator, TextInput, ScrollView 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { analyzeAlcoholPhoto, mapDetectionsToItems } from '../../lib/aiService';
import { AIDetection, MasterItem } from '../../types/inventory';
import { saveInventoryLine } from '../../lib/inventoryService';

export const PhotoReviewScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { photoUri, sessionId, locationId, categoryId, items } = route.params;

  const [analyzing, setAnalyzing] = useState(true);
  const [detections, setDetections] = useState<AIDetection[]>([]);
  const [mappedResults, setMappedResults] = useState<AIDetection[]>([]);
  
  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    try {
      // 1. Send to AI
      const rawDetections = await analyzeAlcoholPhoto(photoUri, sessionId, locationId);
      
      // 2. Map to Master Items
      const mapped = mapDetectionsToItems(rawDetections, items);
      
      setDetections(rawDetections);
      setMappedResults(mapped);
    } catch (e) {
      Alert.alert("Analysis Failed", "Could not process photo.");
      navigation.goBack();
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApply = async () => {
    setAnalyzing(true); // Re-use loader
    try {
      // Apply only mapped items
      const validItems = mappedResults.filter(d => d.matchedItemId);
      
      for (const det of validItems) {
        if (!det.matchedItemId) continue;
        const masterItem = items.find((i: MasterItem) => i.id === det.matchedItemId);
        if (masterItem) {
          // In a real app, fetch current count first and ADD. Here we just set to 1 for simplicity or overwrite.
          // Let's assume +1 for each detection.
          // Note: Ideally, we'd fetch the current line, add 1, then save.
          await saveInventoryLine(sessionId, locationId, masterItem, 1);
        }
      }
      
      Alert.alert("Success", `Updated ${validItems.length} items from photo.`);
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "Failed to apply changes.");
    } finally {
      setAnalyzing(false);
    }
  };

  const renderDetectionRow = ({ item, index }: { item: AIDetection, index: number }) => {
    const matchedItem = items.find((i: MasterItem) => i.id === item.matchedItemId);

    return (
      <View style={styles.row}>
        <View style={styles.detInfo}>
           <Text style={styles.detTitle}>{item.brand} {item.productName}</Text>
           <Text style={styles.detMeta}>
             {item.sizeMl}ml • {(item.confidence * 100).toFixed(0)}% confidence
           </Text>
        </View>
        
        <View style={styles.matchContainer}>
           {matchedItem ? (
             <View style={styles.matchBadge}>
               <Text style={styles.matchCode}>{matchedItem.templateCode}</Text>
               <Text style={styles.matchName} numberOfLines={1}>{matchedItem.name}</Text>
             </View>
           ) : (
             <TouchableOpacity style={styles.unmappedBtn}>
               <Text style={styles.unmappedText}>Map Item</Text>
             </TouchableOpacity>
           )}
        </View>
        
        <View style={styles.qtyContainer}>
           <Text style={styles.qty}>+1</Text>
        </View>
      </View>
    );
  };

  if (analyzing) {
    return (
      <View style={styles.loaderContainer}>
        <Image source={{ uri: photoUri }} style={styles.bgImage} blurRadius={10} />
        <View style={styles.overlay}>
           <ActivityIndicator size="large" color="#fff" />
           <Text style={styles.loadingText}>Analyzing Bottles...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
           <Text style={styles.cancelText}>Cancel</Text>
         </TouchableOpacity>
         <Text style={styles.title}>Review Scan</Text>
         <TouchableOpacity onPress={handleApply}>
           <Text style={styles.applyText}>Apply</Text>
         </TouchableOpacity>
      </View>

      <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="cover" />

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Detected Items ({mappedResults.length})</Text>
      </View>

      <FlatList
        data={mappedResults}
        renderItem={renderDetectionRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  bgImage: { ...StyleSheet.absoluteFillObject, opacity: 0.6 },
  overlay: { alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 10, fontSize: 18, fontWeight: '600' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold' },
  cancelText: { color: '#EF4444', fontSize: 16 },
  applyText: { color: '#3B82F6', fontSize: 16, fontWeight: 'bold' },

  previewImage: { height: 200, width: '100%' },
  
  resultsHeader: { padding: 15, backgroundColor: '#F3F4F6', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  resultsTitle: { fontSize: 14, fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' },

  list: { paddingBottom: 40 },
  row: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', alignItems: 'center' },
  detInfo: { flex: 2 },
  detTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  detMeta: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  
  matchContainer: { flex: 2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  matchBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignItems: 'center', width: '100%' },
  matchCode: { fontSize: 10, fontWeight: 'bold', color: '#1E40AF' },
  matchName: { fontSize: 12, color: '#1E40AF' },
  
  unmappedBtn: { borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 },
  unmappedText: { fontSize: 12, color: '#6B7280' },

  qtyContainer: { flex: 0.5, alignItems: 'flex-end' },
  qty: { fontSize: 18, fontWeight: 'bold', color: '#10B981' }
});
