import axios from "axios";

export const ADD_ITEM = "ADD_ITEM";
export const SELECT_REST = "SELECT_REST";
export function addItemByOwner(itemData, config) {
  return function(dispatch) {
    axios
      .post(
        "http://localhost:3001/grubhub/owner/menu/insertitem",
        itemData,
        config
      )
      .then(response => {
        if (response.data) {
          var itemData = {
            item_Id: response.data._id,
            restaurant_Id: response.data.restaurant_Id,
            item_name: response.data.item_name,
            item_description: response.data.item_description,
            section: response.data.section,
            item_image_name: response.data.item_image_name
          };
          alert(
            "Successfully inserted an item. Now upload an image for the item."
          );
          dispatch({
            type: ADD_ITEM,
            payload: itemData
          });
        }
      })
      .catch(error => {
        console.log("Post Item Server error");
        alert(error);
        window.location.replace("/OwnerHome");
      });
  };
}

export function selectRestaurant(restId) {
  return function(dispatch) {
    var resultData = {
      selectedRestId: restId
    };
    dispatch({
      type: SELECT_REST,
      payload: resultData
    });
  };
}
