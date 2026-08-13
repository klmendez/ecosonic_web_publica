export type HumanValidation={point:number;period:string;minute:number;decision:'accept'|'reject'|'propose';predicted_amount:number;response_amount:number;confidence:number;place:string};
const config={apiKey:import.meta.env.VITE_FIREBASE_API_KEY,authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,storageBucket:import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,messagingSenderId:import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,appId:import.meta.env.VITE_FIREBASE_APP_ID};
export const firebaseConfigured=Boolean(config.apiKey&&config.projectId&&config.appId);
export async function saveHumanValidation(entry:HumanValidation){
  if(!firebaseConfigured)throw Error('FIREBASE_NOT_CONFIGURED');
  const[{getApp,getApps,initializeApp},{addDoc,collection,getFirestore,serverTimestamp}]=await Promise.all([import('firebase/app'),import('firebase/firestore')]);
  const app=getApps().length?getApp():initializeApp(config);
  const result=await addDoc(collection(getFirestore(app),'validaciones_human_in_the_loop'),{...entry,study:'ecosonic_popayan',version:'web_publica_1',created_at:serverTimestamp()});
  return result.id;
}
