const ItemsModel = require('./itemModel');

class ItemsService {

    static async getItems() {
        try {
            return await ItemsModel.getItems();
        } catch (error) {
            throw error;
        }
    }

    static async getItemById(itemId) {
        try {
            return await ItemsModel.getItemById(itemId);
        } catch (error) {
            throw error;
        }
    }

    static async addItem(itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse) {
        try {
            return await ItemsModel.addItem(itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse);
        } catch (error) {
            throw error;
        }
    }

    static async deleteItem(itemId) {
        try {
            return await ItemsModel.deleteItem(itemId);
        } catch (error) {
            throw error;
        }
    }

    static async updateItem(itemId, itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse) {
        try {
            return await ItemsModel.updateItem(itemId, itemname, itemdescription, itempicture, postalcode, city, queuetruepickfalse);
        } catch (error) {
            throw error;
        }
    }

    

}

module.exports = ItemsService;