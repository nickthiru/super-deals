// @ts-nocheck
import * as R from "ramda";

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, fetch }) => {
    console.log("Inside '/merchant/deals/add/+page.server.js");
    // console.log("event: " + JSON.stringify(event, null, 2));


    const formData = await request.formData();

    const merchantId = formData.get("merchantId");
    console.log("merchantId: " + merchantId);

    const title = formData.get("title");
    console.log("title: " + title);

    const originalPrice = formData.get("originalPrice");
    console.log("originalPrice: " + originalPrice);

    const discount = formData.get("discount");
    console.log("discount: " + discount);

    // const logoFileInBase64 = formData.get("logoFileInBase64");
    // console.log("logoFileInBase64: " + logoFileInBase64);
    // console.log('typeof logoFileInBase64: ' + typeof logoFileInBase64);
    // console.log("logoFileInBase64 is empty: " + R.isEmpty(logoFileInBase64));

    const logo = formData.get("logo");
    console.log("logo: " + logo);
    console.log('typeof logo: ' + typeof logo);
    console.log("logo is empty: " + R.isEmpty(logo));

    const category = formData.get("category");
    console.log("category: " + category);

    // const expiration = formData.get("expiration");
    // console.log("expiration: " + expiration);

    const deal = {
      merchantId,
      title,
      originalPrice,
      discount,
      logo,
      // logoFileInBase64,
      category,
      // expiration,
    };

    // const response = await fetch("https://mms6a4j564.execute-api.us-east-1.amazonaws.com/prod/merchant/deals", {
    //   method: "POST",
    //   body: JSON.stringify(deal),
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // });

    // const result = await response.json();
    // console.log("result: ", JSON.stringify(result, null, 2));
  }
};
