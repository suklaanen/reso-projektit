import React, { useState, useEffect } from "react";
import { Text, View, Button, TouchableOpacity } from "react-native";
import { BasicSection } from "../../components/CommonComponents";
import globalStyles from "../../assets/styles/Styles.js";
import Toast from "react-native-toast-message";
import {
  getCurrentUserQueues,
  getUserPositionInQueue,
} from "../../services/firestoreQueues.js";
import {
  fetchQueueCount,
  getCurrentUserItemQueues,
} from "../../services/firestoreItems.js";
import { useAuth } from "../../context/AuthenticationContext";
import Icon from "react-native-vector-icons/Ionicons";
import useItemStore from "../../store/useItemStore";
import { formatTimestamp } from "../../services/firestoreGlobal";

export const ItemJoinOnQueue = ({ itemId }) => {
  const [isOnQueue, setIsOnQueue] = useState(false);
  const [isMyItem, setIsMyItem] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [queuePosition, setQueuePosition] = useState(null);
  const { user } = useAuth();
  const [loadingQueue, setLoadingQueue] = useState(true);

  const addUserToItemQueue = useItemStore((state) => state.addUserToQueue);
  const deleteItemFromQueue = useItemStore(
    (state) => state.removeUserFromQueue
  );
  const checkItemOwnership = useItemStore((state) => state.checkItemOwnership);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingQueue(true);
      try {
        const isOwner = await checkItemOwnership(user.id, itemId);
        setIsMyItem(isOwner);
        const onQueue = await getCurrentUserQueues(user.id, itemId);
        setIsOnQueue(onQueue);
        const count = await fetchQueueCount(itemId);
        setQueueCount(count);

        if (onQueue) {
          const position = await getUserPositionInQueue(user.id, itemId);
          setQueuePosition(position);
        }
      } catch (error) {
        console.error("Virhe tietojen hakemisessa:", error);
      } finally {
        setLoadingQueue(false);
      }
    };
    fetchData();
  }, [itemId]);

  const handleSaveForQueue = async () => {
    try {
      const { queueCount, queuePosition } = await addUserToItemQueue(
        user.id,
        itemId
      );
      setIsOnQueue(true);
      setQueueCount(queueCount);
      setQueuePosition(queuePosition);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Virhe varausta tehdessä",
        text2: error.message,
      });
    }
  };

  const handleDeleteFromQueue = async () => {
    try {
      const queueCount = await deleteItemFromQueue(user.id, itemId);
      setIsOnQueue(false);
      setQueueCount(queueCount);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Virhe jonosta poistettaessa",
        text2: error.message,
      });
    }
  };

  if (loadingQueue) {
    return <Text>Ladataan...</Text>;
  }

  return (
    <>
      {isMyItem ? (
        <Text>Oma ilmoitus: Jonottajia: {queueCount}</Text>
      ) : (
        <View style={globalStyles.iconContainer}>
          <TouchableOpacity
            onPress={handleSaveForQueue}
            disabled={isOnQueue}
            style={globalStyles.iconButton}
          >
            <Icon
              name="checkmark-circle"
              color={isOnQueue ? "#bdbdbd" : "#195010"}
              style={globalStyles.iconsOnUse}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteFromQueue}
            disabled={!isOnQueue}
            style={globalStyles.iconButton}
          >
            <Icon
              name="close-circle"
              color={!isOnQueue ? "#bdbdbd" : "#790809"}
              style={globalStyles.iconsOnUse}
            />
          </TouchableOpacity>

          {isOnQueue ? (
            <Text style={globalStyles.iconText}>
              Varauksen sija: {queuePosition}
            </Text>
          ) : (
            <Text style={globalStyles.iconText}>Jonottajia: {queueCount}</Text>
          )}
        </View>
      )}
    </>
  );
};

function ListItem({ item }) {
  const {
    itemname,
    itemdescription,
    city,
    postalcode,
    givername,
    createdAt,
    id,
  } = item;
  return (
    <View style={globalStyles.itemContainer}>
      <Text style={globalStyles.itemName}>{itemname}</Text>
      <Text>{itemdescription}</Text>
      <Text>
        Sijainti: {city}, {postalcode}
      </Text>
      <Text>Julkaisija: {givername}</Text>
      <Text>{formatTimestamp(createdAt)}</Text>
      <ItemJoinOnQueue itemId={id} />
    </View>
  );
}

const ItemList = ({ items }) => items.map((item) => <ListItem item={item} />);

export const ItemQueues = () => {
  const [items, setItems] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const authState = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 4;

  const fetchData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const { items: newItems, lastDoc: newLastDoc } =
        await getCurrentUserItemQueues(authState.user.id, lastDoc, pageSize);
      setItems((prevItems) => [...prevItems, ...newItems]);
      setLastDoc(newLastDoc);

      if (newItems.length < pageSize) {
        setHasMore(false);
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Ei enempää kohteita" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && items.length === 0) {
    return (
      <BasicSection>
        {" "}
        <Text>Ladataan...</Text>{" "}
      </BasicSection>
    );
  }

  if (error) {
    return (
      <BasicSection>
        {" "}
        <Text>Virhe: {error.message}</Text>{" "}
      </BasicSection>
    );
  }

  return (
    <View style={globalStyles.container}>
      {items.length > 0 ? (
        <ItemList items={items} />
      ) : (
        <BasicSection>
          <Text>Ei varauksia</Text>
        </BasicSection>
      )}
      )
      {hasMore && (
        <Button title="Näytä lisää" onPress={fetchData} disabled={loading} />
      )}
      {!hasMore && (
        <Text style={{ textAlign: "center", marginTop: 16 }}>
          Ei enempää kohteita
        </Text>
      )}
    </View>
  );
};
