"use client";

import { triggerSOS } from "@/lib/api";

export default function SOSPage(){

const sendSOS = async()=>{

const result = await triggerSOS(1);

console.log(result);

alert("SOS Sent 🚨");

};

return(
<main>
<h1>SafeNex SOS</h1>

<button onClick={sendSOS}>
🚨 Trigger SOS
</button>

</main>
);

}