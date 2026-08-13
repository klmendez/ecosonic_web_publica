import { useEffect, useState } from "react";

type Props={point:number;period:string;minute:number;amount:number;place:string};
type Decision="accept"|"reject"|"propose";
const money=(value:number)=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(value);

export function HumanFeedback({point,period,minute,amount,place}:Props){
  const[decision,setDecision]=useState<Decision>();
  const[proposal,setProposal]=useState("");
  const[confidence,setConfidence]=useState(0);
  const[status,setStatus]=useState<"idle"|"sending"|"sent"|"error">("idle");
  useEffect(()=>{setDecision(undefined);setProposal("");setConfidence(0);setStatus("idle")},[point,period,minute,amount]);
  const responseAmount=decision==="accept"?amount:decision==="reject"?0:Number(proposal);
  const valid=Boolean(decision&&confidence&&Number.isFinite(responseAmount)&&responseAmount>=0&&(decision!=="propose"||proposal!==""));
  async function submit(){
    if(!valid)return;setStatus("sending");
    try{const entry={point,period,minute,decision,predicted_amount:amount,response_amount:responseAmount,confidence,created_at:new Date().toISOString()};const previous=JSON.parse(localStorage.getItem("ecosonic_human_feedback")||"[]");localStorage.setItem("ecosonic_human_feedback",JSON.stringify([...previous,entry]));setStatus("sent")}catch{setStatus("error")}
  }
  return <section className="humanLoop" id="evaluar-modelo">
    <div className="humanLoopIntro"><small>HUMAN-IN-THE-LOOP</small><h3>¿Quieres ayudarnos a evaluar el modelo?</h3><p>Después de observar la evidencia de <b>{place}</b>, indícanos si esta valoración representa lo que aportarías mensualmente.</p></div>
    <div className="humanOffer"><span>El modelo estima un aporte mensual de</span><strong>{money(amount)}</strong><p>para apoyar acciones de conservación y mejoramiento ambiental y acústico del sector.</p></div>
    {status==="sent"?<div className="feedbackThanks"><strong>Evaluación registrada</strong><span>Tu respuesta quedó asociada al punto {String(point).padStart(2,"0")}, {period}, minuto {minute}, sin recopilar datos personales.</span></div>:<>
      <div className="decisionGroup" aria-label="Respuesta sobre el valor estimado">
        <button className={decision==="accept"?"selected":undefined} onClick={()=>setDecision("accept")}>Sí, confirmo ese valor</button>
        <button className={decision==="reject"?"selected reject":undefined} onClick={()=>setDecision("reject")}>No aportaría</button>
        <button className={decision==="propose"?"selected propose":undefined} onClick={()=>setDecision("propose")}>Propondría otro monto</button>
      </div>
      {decision==="propose"&&<label className="proposalField">Monto mensual que propondrías (COP)<input type="number" min="0" max="10000000" step="100" value={proposal} onChange={e=>setProposal(e.target.value)} placeholder="Ejemplo: 3000"/></label>}
      <fieldset className="confidenceScale"><legend>¿Qué tan seguro(a) estás de tu respuesta?</legend>{["Nada seguro","Poco seguro","Moderadamente seguro","Seguro","Muy seguro"].map((label,i)=><label key={label}><input type="radio" name="feedback-confidence" checked={confidence===i+1} onChange={()=>setConfidence(i+1)}/><b>{i+1}</b><span>{label}</span></label>)}</fieldset>
      <div className="feedbackSubmit"><p>Esta es una valoración hipotética para fines de investigación; no constituye un cobro ni una donación.</p><button disabled={!valid||status==="sending"} onClick={submit}>{status==="sending"?"Guardando…":"Enviar evaluación"}</button>{status==="error"&&<span>No fue posible guardar. Inténtalo nuevamente.</span>}</div>
    </>}
  </section>
}
