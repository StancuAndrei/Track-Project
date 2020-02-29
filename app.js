//!Storage Controller
const StorageCtrl = (function() {

    //*public methods
    return {
        storeItem: function(item) {
            let items;
            //*Check if anu items in local storage
            if (localStorage.getItem("items") === null) {
                items = [];
                //* push new item
                items.push(item);

                //*set local storage
                localStorage.setItem("items", JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem("items"));

                //* push the new item
                items.push(item);
                //*reset local storage
                localStorage.setItem("items", JSON.stringify(items));
            }

        },
        getItemsFromStorage: function() {
            let items;
            if (localStorage.getItem("items") === null) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem("items"));
            }
            return items;
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem("items"));

            items.forEach(function(item, index) {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem("items", JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem("items"));

            items.forEach(function(item, index) {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem("items", JSON.stringify(items));
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem("items");
        }

    }

})();








//!Item Controller
const ItemCtrl = (function() {
    //*item constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //*data structure / state
    const data = {
        // items: [
        //     // { id: 0, name: "Steak Dinner", calories: 1200 },
        //     // { id: 0, name: "Hot Dog", calories: 400 },
        //     // { id: 0, name: "E.g. Cookie", calories: 600 }
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    //* public methods
    return {
        logData: function() {
            return data;
        },
        addItem: function(name, calories) {
            let ID;
            //*craete ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //* calories to number
            calories = parseInt(calories);

            //* Create new item
            newItem = new Item(ID, name, calories);

            //* add to items array
            data.items.push(newItem);

            return newItem;
        },

        getTotalCalories: function() {
            let total = 0;
            //* loop to get total calories
            data.items.forEach(function(item) {
                total += item.calories;
            });
            //*set total calories in data structure
            data.totalCalories = total;
            //*return total
            return data.totalCalories;
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getItemById: function(id) {
            let found = null;
            //*loop items
            data.items.forEach(function(item) {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories) {
            //* cals to nums
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id) {
            //*get multiple id
            const ids = data.items.map(function(item) {
                return item.id;
            });

            //*get index
            const index = ids.indexOf(id);
            //*remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function() {
            data.items = [];
        },
        getItems: function() {
            return data.items;
        }
    }


})();






//!UI Controller
const UICtrl = (function() {
    const UISelectors = {
        itemList: "#item-list",
        listItems: "#item-list li",
        addBtn: ".add-btn",
        itemNameInput: '#item-name',
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        updateBtn: ".update-btn",
        clearBtn: ".clear-btn"
    }


    //* public methods
    return {
        populateItemList: function(items) {
            let html = "";

            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });

            //* insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            //*show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //*create li element
            const li = document.createElement("li");
            //*add a class
            li.className = "collection-item";
            //Add ID
            li.id = `item-${item.id}`;
            //*add html
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            //*insert ITEM
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);

        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //* turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute("id");

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";

        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value =
                ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value =
                ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //* turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item) {
                item.remove();
            });
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";

        },
        showEditState: function() {

            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";

        },

        getSelectors: function() {
            return UISelectors;
        }

    }
})();








//!App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    //*load event listeners
    const loadEventListeners = function() {
        //* get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //*add item event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

        //* disable submit on enter
        document.addEventListener("keypress", function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        //*edit icont click
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

        //* update item
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

        //* back btn
        document.querySelector(UISelectors.backBtn).addEventListener("click", UICtrl.clearEditState);

        //* delete item
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

        //* clear items
        document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);

    }


    //*todo add item submit
    const itemAddSubmit = function(e) {
        //* get form input from ui ctrl
        const input = UICtrl.getItemInput();

        //*check for name and calorie input
        if (input.name !== "" && input.calories !== "") {
            //* add item to ui
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            //*get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //*add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //*add item to UI list
            UICtrl.addListItem(newItem);

            //!Store in localStorage
            StorageCtrl.storeItem(newItem);


            //*clear input fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    //*todo click edit item
    const itemEditClick = function(e) {
        if (e.target.classList.contains("edit-item")) {
            //*get item from list id (item-0)
            const listId = e.target.parentNode.parentNode.id;

            //break into array
            const listIdArr = listId.split("-");

            //*get acutal id
            const id = parseInt(listIdArr[1]);

            //*get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //* set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //* add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    //*todo update item
    const itemUpdateSubmit = function(e) {
        //* get item input
        const input = UICtrl.getItemInput();
        //*update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //*update UI
        UICtrl.updateListItem(updatedItem);

        //*get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //*add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //* update local storage
        StorageCtrl.updateItemStorage(updatedItem);


        UICtrl.clearEditState();


        e.preventDefault();
    }

    //*TODO item delete submit
    const itemDeleteSubmit = function(e) {
        //* get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //*delete form data structure
        ItemCtrl.deleteItem(currentItem.id);

        //*delete form UI
        UICtrl.deleteListItem(currentItem.id);

        //*get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //*add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //*delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();


        e.preventDefault();
    }

    //*todo clear all items
    const clearAllItemsClick = function() {
        //*delete all items from data structure
        ItemCtrl.clearAllItems();

        //*get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //*add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //* remove from UI
        UICtrl.removeItems();

        //*clear from local storage
        StorageCtrl.clearItemsFromStorage();

        //*hide the ul cuz is nasty
        UICtrl.hideList();

    }



    //* public methods
    return {
        init: function() {
            console.log("Initializign App..");

            //*clear edit state / set
            UICtrl.clearEditState();

            //*Fetch items from data structure
            const items = ItemCtrl.getItems();

            //*check if items are there
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                //*add items to list
                UICtrl.populateItemList(items);
            }

            //*load event listeners
            loadEventListeners();

        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);


//init app
App.init();

// $("ul").on("click", ".edit-item", function(e) {
//     $(this).parent().parent().fadeOut(500, function() {
//         $(this).remove();
//     });
//     e.stopPropagation();
//     e.preventDefault();
// });