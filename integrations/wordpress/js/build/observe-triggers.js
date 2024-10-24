(function () {
	'use strict';

	class ObserveTriggers{constructor(config={}){this.config={baseTriggerClass:"observe-trigger",baseTriggeredClass:"observe-triggered",...config};this.observers=new Map;this.elementStates=new WeakMap;this.init();}init(){this.observeElements();window.addEventListener("DOMContentLoaded",(()=>this.observeElements()));window.addEventListener("load",(()=>this.observeElements()));}parseObserverClass(className){const parts=className.replace(this.config.baseTriggerClass+"-","").split("-");const config={rootMargin:0,threshold:0,edge:"top",action:"toggle",class:"observe-triggered",root:null};let currentPart=0;if(!isNaN(parts[currentPart])){config.rootMargin=parseInt(parts[currentPart]);currentPart++;}if(!isNaN(parts[currentPart])){config.threshold=parseInt(parts[currentPart])/100;currentPart++;}if(["top","bottom","left","right"].includes(parts[currentPart])){config.edge=parts[currentPart];currentPart++;}if(["toggle","add","remove","replace"].includes(parts[currentPart])){config.action=parts[currentPart];currentPart++;}const remainingParts=parts.slice(currentPart);const rootIndex=remainingParts.findIndex((part=>part.startsWith("#")||part.startsWith(".")));if(rootIndex!==-1){config.class=remainingParts.slice(0,rootIndex).join("-");config.root=remainingParts.slice(rootIndex).join("-");}else {config.class=remainingParts.join("-")||config.class;}return config}observeElements(){document.querySelectorAll(`[class*="${this.config.baseTriggerClass}"]`).forEach((element=>{const classes=Array.from(element.classList);classes.forEach((className=>{if(className.startsWith(this.config.baseTriggerClass)){this.setupObserver(element,className);}}));}));}setupObserver(element,className){const config=this.parseObserverClass(className);const rootMargin=100-parseInt(config.rootMargin);const options={root:null,threshold:config.threshold};if("top"===config.edge){options.rootMargin="50% 0px -"+rootMargin+"% 0px";}else if("bottom"===config.edge){options.rootMargin="-"+rootMargin+"% 0px 50% 0px";}else if("left"===config.edge){options.rootMargin="0px -"+rootMargin+"% 0px 50%";}else if("right"===config.edge){options.rootMargin="0px 50% 0px -"+rootMargin+"%";}const observer=new IntersectionObserver((entries=>{entries.forEach((entry=>{this.handleIntersection(element,entry,config,className);}));}),options);observer.observe(element);if(!this.observers.has(element)){this.observers.set(element,new Map);}this.observers.get(element).set(className,observer,false);}handleIntersection(element,entry,config,className){const elementStates=this.elementStates.get(element)||new Map;const hasTriggered=elementStates.get(className);const isTriggered=entry.intersectionRatio>config.threshold;if(entry.isIntersecting||hasTriggered){switch(config.action){case"add":if(entry.isIntersecting&&isTriggered){element.classList.add(config.class);}break;case"remove":if(entry.isIntersecting&&isTriggered){element.classList.remove(config.class);}break;case"replace":element.classList.forEach((otherClass=>{if(otherClass.startsWith(this.config.baseTriggerClass)){const otherConfig=this.parseObserverClass(otherClass);if(otherConfig.class!==config.class){element.classList.remove(otherConfig.class);}}}));element.classList.add(config.class);break;case"toggle":default:element.classList.toggle(config.class,isTriggered);break}}if(config.action.includes(["add","remove"])&&isTriggered){this.disconnectObserver(element,className);}if(!hasTriggered&&isTriggered){elementStates.set(className,true);}else {elementStates.set(className,false);}this.elementStates.set(element,elementStates);this.dispatchEvent(element,isTriggered,config,className);}disconnectObserver(element,className){const observers=this.observers.get(element);if(observers&&observers.has(className)){observers.get(className).disconnect();observers.delete(className);if(observers.size===0){this.observers.delete(element);}}}dispatchEvent(element,isIntersecting,config,className){const event=new CustomEvent("observerTriggered",{detail:{element:element,isIntersecting:isIntersecting,config:config,className:className}});window.dispatchEvent(event);}destroy(){this.observers.forEach(((observers,element)=>{observers.forEach((observer=>observer.disconnect()));}));this.observers.clear();this.elementStates.clear();}}

	new ObserveTriggers();

})();
