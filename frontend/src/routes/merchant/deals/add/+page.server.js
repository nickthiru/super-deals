/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, fetch }) => {
    console.log("Inside '/merchant/deals/add/+page.server.js");
    // console.log("event: " + JSON.stringify(event, null, 2));


    const formData = await request.formData();

    // Validate the deal data
    if (!formData.get("merchantId") || !formData.get("title") || !formData.get("originalPrice") || !formData.get("discount") || !formData.get("logo") || !formData.get("category")) {
      console.log("Invalid deal data");
      // return {
      //   status: 400,
      //   body: JSON.stringify({ message: 'Invalid deal data' }),
      // };

      return {
        status: 400,
        body: {
          errors: {
            message: 'Invalid deal data'
          }
        }
      };
    }

    // const merchantId = formData.get("merchantId");
    // console.log("merchantId: " + merchantId);

    // const title = formData.get("title");
    // console.log("title: " + title);

    // const originalPrice = formData.get("originalPrice");
    // console.log("originalPrice: " + originalPrice);

    // const discount = formData.get("discount");
    // console.log("discount: " + discount);

    // const logoFileInBase64 = formData.get("logoFileInBase64");
    // console.log("logoFileInBase64: " + logoFileInBase64);
    // console.log('typeof logoFileInBase64: ' + typeof logoFileInBase64);
    // console.log("logoFileInBase64 is empty: " + R.isEmpty(logoFileInBase64));

    // const logo = formData.get("logo");
    // console.log("logo: " + logo);
    // console.log('typeof logo: ' + typeof logo);
    // console.log("logo is empty: " + R.isEmpty(logo));

    // const category = formData.get("category");
    // console.log("category: " + category);

    // const expiration = formData.get("expiration");
    // console.log("expiration: " + expiration);

    // const deal = {
    //   merchantId,
    //   title,
    //   originalPrice,
    //   discount,
    //   logo,
    //   logoFileInBase64,
    //   category,
    //   expiration,
    // };

    // Send the request to the backend API to add the new deal
    // const response = await fetch("https://mms6a4j564.execute-api.us-east-1.amazonaws.com/prod/merchant/deals", {
    //   method: "POST",
    //   body: formData,
    // });

    // Handle the response from the backend API
    // if (response.ok) {
    //   return {
    //     status: 201,
    //     body: JSON.stringify({ message: 'Deal added successfully' }),
    //   };
    // } else {
    //   return {
    //     status: response.status,
    //     body: JSON.stringify({ message: 'Error adding deal' }),
    //   };
    // }
  }
};
