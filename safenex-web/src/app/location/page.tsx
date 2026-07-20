"use client";

import { updateLocation } from "@/lib/api";

export default function LocationPage(){

const sendLocation = ()=>{

navigator.geolocation.getCurrentPosition(async(position)=>{

await updateLocation({

user_id:1,

latitude: position.coords.latitude,

longitude: position.coords.longitude,

source:"web",

device_id:"browser",

sensor_data:{}

});

alert("Location Sent 📍");

});

};


return(

<main>

<h1>SafeNex Location</h1>

<button onClick={sendLocation}>
Send Location
</button>

</main>

);

}