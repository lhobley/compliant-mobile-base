// ============================================================================
// INVENTORY SCREENS (REACT NATIVE / EXPO)
// Note: These files are designed to be used in an Expo project.
// Dependencies required: 
// npm install expo-camera expo-image-picker
// ============================================================================

import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, ScrollView, ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CATEGORIES, InventorySession, InventoryCategory } from '../../types/inventory';
import { startInventorySession, completeInventorySession, seedMasterInventory, getCategoryProgress } from '../../lib/inventoryService';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Mock User & Location for Demo
const CURRENT_LOCATION_ID = 'loc_main_bar';
const CURRENT_USER_ID = 'u1';

export const InventoryHomeScreen = () => {
  const navigation = useNavigation<any>();
  const [activeSession, setActiveSession] = useState<InventorySession | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    if (!db) return;
    setLoading(true);
    try {
      // Find incomplete session
      const q = query(
        collection(db, 'inventorySessions'),
        where('locationId', '==', CURRENT_LOCATION_ID),
        where('status', '==', 'in_progress'),
        orderBy('startedAt', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const session = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as InventorySession;
        setActiveSession(session);
        // Load progress
        const prog: Record<string, number> = {};
        for (const cat of CATEGORIES) {
          const count = await getCategoryProgress(session.id, cat.id);
          prog[cat.id] = count;
        }
        setCategoryProgress(prog);
      } else {
        setActiveSession(null);
      }
    } catch (e) {
      console.error("Error fetching sessions:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    setLoading(true);
    try {
      // Ensure master items exist (Demo helper)
      await seedMasterInventory(); 
      
      const sessionId = await startInventorySession(CURRENT_LOCATION_ID, CURRENT_USER_ID);
      setActiveSession({
        id: sessionId,
        locationId: CURRENT_LOCATION_ID,
        startedAt: new Date(),
        status: 'in_progress',
        createdBy: CURRENT_USER_ID
      });
      setCategoryProgress({});
    } catch (e) {
      Alert.alert("Error", "Could not start session.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!activeSession) return;
    Alert.alert(
      "Finish Inventory?",
      "This will update stock levels and close the session.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Complete", 
          onPress: async () => {
            await completeInventorySession(activeSession.id, CURRENT_LOCATION_ID);
            setActiveSession(null);
            Alert.alert("Success", "Inventory session completed.");
          }
        }
      ]
    );
  };

  const renderCategory = ({ item }: { item: InventoryCategory }) => {
    const counted = categoryProgress[item.id] || 0;
    const isComplete = counted >= item.targetItemCount;

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => {
          if (!activeSession) {
            Alert.alert("No Session", "Start a new inventory session first.");
            return;
          }
          navigation.navigate('CategoryDetail', { 
            sessionId: activeSession.id,
            categoryId: item.id,
            categoryName: item.name
          });
        }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.targetItemCount} items</Text>
        </View>
        <View style={styles.progressContainer}>
           <Text style={[styles.progressText, isComplete && styles.textGreen]}>
             {counted} / {item.targetItemCount} counted
           </Text>
           <View style={styles.progressBarBg}>
             <View style={[
               styles.progressBarFill, 
               { width: `${Math.min(100, (counted / item.targetItemCount) * 100)}%` },
               isComplete && { backgroundColor: '#10B981' }
             ]} />
           </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bar Inventory</Text>
        <Text style={styles.subtitle}>Main Bar • {new Date().toLocaleDateString()}</Text>
      </View>

      {!activeSession ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No active inventory session.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartSession}>
             <Text style={styles.buttonText}>Start New Count</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.sessionBanner}>
             <Text style={styles.sessionText}>In Progress • Started {new Date(activeSession.startedAt?.toDate?.() || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
          </View>
          <FlatList
            data={CATEGORIES.sort((a,b) => a.displayOrder - b.displayOrder)}
            renderItem={renderCategory}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.footer}>
             <TouchableOpacity style={[styles.primaryButton, {backgroundColor: '#EF4444'}]} onPress={handleCompleteSession}>
                <Text style={styles.buttonText}>Complete Session</Text>
             </TouchableOpacity>
          </View>
        </>
      )}

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  listContent: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  cardSubtitle: { fontSize: 14, color: '#9CA3AF' },
  progressContainer: {},
  progressText: { fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: '500' },
  textGreen: { color: '#10B981' },
  progressBarBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 3 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#6B7280', marginBottom: 20 },
  primaryButton: { backgroundColor: '#1F2937', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sessionBanner: { backgroundColor: '#DBEAFE', padding: 12, alignItems: 'center' },
  sessionText: { color: '#1E40AF', fontWeight: '600', fontSize: 12 },
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  loader: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center' }
});
