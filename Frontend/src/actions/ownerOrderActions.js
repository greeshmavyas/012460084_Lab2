import axios from "axios";
export const UPDATE_STATUS = "UPDATE_STATUS";
export function updateOrderStatus(orderData, config) {
  return function(dispatch) {
    axios
      .post(
        "http://localhost:3001/grubhub/owner/orders/updatestatus",
        orderData,
        config
      )
      .then(response => {
        if (response.data) {
          console.log(response);
          console.log(response.data);
          console.log(JSON.stringify(response));
          var updatedOrder = {
            order_Id: response.data._id,
            restaurant_Id: response.data.restaurant_Id,
            delivery_address: response.data.delivery_address,
            status: response.data.status,
            last_modified_on: response.data.last_modified_on
          };
          alert("Successfully Updated the status of the order");
          dispatch({
            type: UPDATE_STATUS,
            payload: updatedOrder
          });
        }
      })
      .catch(error => {
        console.log("Post Item Server error");
        alert(error);
        //window.location.replace("/OwnerHome");
      });
  };
}
