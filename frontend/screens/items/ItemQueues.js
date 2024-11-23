import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Button, TouchableOpacity } from 'react-native';
import { BasicSection } from '../../components/CommonComponents';
import globalStyles from "../../assets/styles/Styles.js";
import Toast from 'react-native-toast-message';
import { 
  addTakerToItem,
  deleteTakerFromItem,
  getCurrentUserQueues,
  getCurrentUserQueuesForItems,
  getUserPositionInQueue,
} from '../../services/firestoreQueues.js';
import { checkIfMyItem, fetchQueueCount } from '../../services/firestoreItems.js';
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { set } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';

export const ItemJoinOnQueue = ({ itemId }) => {
  const [isOnQueue, setIsOnQueue] = useState(false);
  const [isMyItem, setIsMyItem] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [queuePosition, setQueuePosition] = useState(null);
  const authState = useContext(AuthenticationContext);

  const saveForQueue = async (itemId) => {
      try {
          await addTakerToItem(authState.user.id, itemId);
          setIsOnQueue(true);
          const updatedCount = await fetchQueueCount(itemId);
          setQueueCount(updatedCount);
      } catch (error) {
          Toast.show({ type: 'error', text1: 'Virhe varausta tehdessä', text2: error.message });
      }
  };

  const deleteFromQueue = async (itemId) => {
      try {
          await deleteTakerFromItem(authState.user.id, itemId);
          setIsOnQueue(false);
          const updatedCount = await fetchQueueCount(itemId);
          setQueueCount(updatedCount);
      } catch (error) {
          Toast.show({ type: 'error', text1: 'Virhe jonosta poistettaessa', text2: error.message });
      }
  };

  useEffect(() => {
      const fetchData = async () => {
          try {
              const isOwner = await checkIfMyItem(authState.user.id, itemId);
              setIsMyItem(isOwner);

              const onQueue = await getCurrentUserQueues(authState.user.id, itemId);
              setIsOnQueue(onQueue);

              const count = await fetchQueueCount(itemId);
              setQueueCount(count);

              if (onQueue) {
                const position = await getUserPositionInQueue(authState.user.id, itemId);
                setQueuePosition(position);
            }
          } catch (error) {
              console.error('Virhe tietojen hakemisessa:', error);
          }
      };

      fetchData();
  }, [itemId]);

  return (
      <>
          {isMyItem ? (
              <Text>Oma ilmoitus: Jonottajia: {queueCount}</Text>
          ) : (
              <View style={globalStyles.iconContainer}>
                  <TouchableOpacity 
                      onPress={() => saveForQueue(itemId)} 
                      disabled={isOnQueue} 
                      style={[globalStyles.iconButton]}>
                      <Icon 
                          name="checkmark-circle" 
                          color={isOnQueue ? '#bdbdbd' : '#195010'} 
                          style={globalStyles.iconsOnUse} 
                      />
                  </TouchableOpacity>

                  <TouchableOpacity 
                      onPress={() => deleteFromQueue(itemId)} 
                      disabled={!isOnQueue} 
                      style={[globalStyles.iconButton]}>
                      <Icon 
                          name="close-circle" 
                          color={!isOnQueue ? '#bdbdbd' : '#790809'} 
                          style={globalStyles.iconsOnUse} 
                      />
                  </TouchableOpacity>

                  {isOnQueue ? (
                      <Text style={globalStyles.iconText}>Varauksen sija: {queuePosition}</Text>
                  ) : (
                      <Text style={globalStyles.iconText}>Jonottajia: {queueCount}</Text>
                  )}
              </View>
          )}
      </>
  );
};

export const ItemQueues = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const pageSize = 4;
  const authState = useContext(AuthenticationContext);

  useEffect(() => {
      const fetchQueues = async () => {
          if (!hasMore) return;

          try {
              const { queues: newQueue, lastDoc: newLastDoc } = await getCurrentUserQueuesForItems(authState.user.id, lastDoc, pageSize);
              if (newQueue) {
                  setQueue((prevQueue) => [...prevQueue, ...newQueue]);
                  setLastDoc(newLastDoc);
                  setHasMore(newQueue.length === pageSize);
              } else {
                  setQueue([]);
                  setHasMore(false);
              }
          } catch (error) {
              console.error('Virhe jonon hakemisessa:', error);
              setError(error);
          } finally {
              setLoading(false);
          }
      };

      fetchQueues();
  }, [lastDoc]);

  if (loading) {
      return (
          <BasicSection>
              <Text>Ladataan...</Text>
          </BasicSection>
      );
  }

  if (error) {
      return (
          <BasicSection>
              <Toast type="error" text1="Virhe jonon hakemisessa" text2={error.message} />
              <Button title="Yritä uudelleen" onPress={() => setError(null) || setLoading(true)} />
          </BasicSection>
      );
  }

  return (
      <View style={globalStyles.container}>
          {queue.length > 0 ? (
              queue.map((item) => (
                  <View key={item.id} style={globalStyles.itemContainer}>
                      <Text style={globalStyles.itemName}>{item.itemname}</Text>
                      <Text>{item.itemdescription}</Text>
                      <Text>Sijainti: {item.postalcode}, {item.city}</Text>
                      <Text>Julkaisija: {item.giverid.id}</Text>
                      <ItemJoinOnQueue itemId={item.id} />
                  </View>
              ))
          ) : (
              <BasicSection style={{ alignItems: 'center', padding: 20 }}>
                  <Text style={{ fontSize: 16, color: '#555' }}>Ei varauksia.</Text>
              </BasicSection>
          )}
          {hasMore && (
              <Button
                  title="Lataa lisää"
                  onPress={() => setLoading(true) || setLastDoc(lastDoc)}
                  disabled={loading}
              />
          )}
      </View>
  );
};