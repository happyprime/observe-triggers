(function () {
	'use strict';

	class ObserveTriggers{constructor(config={}){this.config={baseTriggerClass:"observe-trigger",baseTriggeredClass:"observe-triggered",baseScrollClass:"observe-scroll",baseScrollingClass:"observe-scrolling",scrollOffsetProperty:"--observe-triggers-scroll-offset",offsetTop:0,...config};this.observers=new Map;this.elementStates=new WeakMap;this.scrollElements=new Set;this.boundScrollHandler=this.handleScroll.bind(this);this.documentMutationObserver=null;this.classMutationObserver=null;this.observerId=0;this.init();}init(){this.observeElements();window.addEventListener("DOMContentLoaded",(()=>this.observeElements()));window.addEventListener("load",(()=>this.observeElements()));this.setupScrolls=this.setupScrolls.bind(this);window.addEventListener("observerTriggered",this.setupScrolls);this.documentMutationObserver=new MutationObserver((mutations=>{Array.from(mutations).filter((mutation=>mutation.type==="childList")).forEach((mutation=>{Array.from(mutation.addedNodes).filter((node=>node.nodeType===Node.ELEMENT_NODE)).forEach((node=>{if(node.matches(`[class*="${this.config.baseTriggerClass}"]`)){Array.from(node.classList).filter((className=>className.startsWith(this.config.baseTriggerClass))).forEach((className=>this.setupObserver(node,className)));}node.querySelectorAll(`[class*="${this.config.baseTriggerClass}"]`).forEach((element=>{Array.from(element.classList).filter((className=>className.startsWith(this.config.baseTriggerClass))).forEach((className=>this.setupObserver(element,className)));}));}));}));}));this.documentMutationObserver.observe(document.body,{childList:true,subtree:true});}parseObserverClass(className){const parts=className.replace(this.config.baseTriggerClass+"-","").split("-");const config={rootMargin:0,threshold:0,edge:"top",action:"toggle",class:this.config.baseTriggeredClass,root:null};let currentPart=0;if(!isNaN(parts[currentPart])){config.rootMargin=parseInt(parts[currentPart]);currentPart++;}if(!isNaN(parts[currentPart])){config.threshold=parseInt(parts[currentPart])/100;currentPart++;}if(["top","bottom","left","right"].includes(parts[currentPart])){config.edge=parts[currentPart];currentPart++;}if(["toggle","add","remove","replace"].includes(parts[currentPart])){config.action=parts[currentPart];currentPart++;}const remainingParts=parts.slice(currentPart);const rootIndex=remainingParts.findIndex((part=>part.startsWith("#")||part.startsWith(".")));if(rootIndex!==-1){config.class=remainingParts.slice(0,rootIndex).join("-");config.root=remainingParts.slice(rootIndex).join("-");}else {config.class=remainingParts.join("-")||config.class;}return config}observeElements(){document.querySelectorAll(`[class*="${this.config.baseTriggerClass}"]`).forEach((element=>{const classes=Array.from(element.classList);classes.forEach((className=>{if(className.startsWith(this.config.baseTriggerClass)&&!element.getAttribute("data-observer-id")){this.setupObserver(element,className);}}));}));}setupObserver(element,className){element.setAttribute("data-observer-id",`obs-${++this.observerId}`);const config=this.parseObserverClass(className);const rootMargin=100-parseInt(config.rootMargin);const options={root:null,threshold:config.threshold};if("top"===config.edge){const offsetPercentage=this.config.offsetTop/window.innerHeight*100;const adjustedRootMargin=rootMargin-offsetPercentage;options.rootMargin="50% 0px -"+adjustedRootMargin+"% 0px";}else if("bottom"===config.edge){options.rootMargin="-"+rootMargin+"% 0px 50% 0px";}else if("left"===config.edge){options.rootMargin="0px -"+rootMargin+"% 0px 50%";}else if("right"===config.edge){options.rootMargin="0px 50% 0px -"+rootMargin+"%";}const observer=new IntersectionObserver((entries=>{entries.forEach((entry=>{this.handleIntersection(element,entry,config,className);}));}),options);observer.observe(element);if(!this.observers.has(element)){this.observers.set(element,new Map);}this.observers.get(element).set(className,observer,false);}handleIntersection(element,entry,config,className){const elementStates=this.elementStates.get(element)||new Map;const hasTriggered=elementStates.get(className);const isTriggered=entry.intersectionRatio>config.threshold;if(entry.isIntersecting||hasTriggered){switch(config.action){case "add":if(entry.isIntersecting&&isTriggered){element.classList.add(config.class);}break;case "remove":if(entry.isIntersecting&&isTriggered){element.classList.remove(config.class);}break;case "replace":element.classList.forEach((otherClass=>{if(otherClass.startsWith(this.config.baseTriggerClass)){const otherConfig=this.parseObserverClass(otherClass);if(otherConfig.class!==config.class){element.classList.remove(otherConfig.class);}}}));element.classList.add(config.class);break;case "toggle":default:element.classList.toggle(config.class,isTriggered);break}}if(["add","remove"].includes(config.action)&&isTriggered){this.disconnectObserver(element,className);this.observeClassChanges(element);}if(!hasTriggered&&isTriggered){elementStates.set(className,true);}else {elementStates.set(className,false);}this.elementStates.set(element,elementStates);this.dispatchEvent(element,isTriggered,config,className);}disconnectObserver(element,className){const observers=this.observers.get(element);if(observers&&observers.has(className)){observers.get(className).disconnect();observers.delete(className);if(observers.size===0){this.observers.delete(element);}}}dispatchEvent(element,isIntersecting,config,className){const event=new CustomEvent("observerTriggered",{detail:{element:element,isIntersecting:isIntersecting,config:config,className:className}});window.dispatchEvent(event);}destroy(){this.observers.forEach(((observers,element)=>{observers.forEach((observer=>observer.disconnect()));}));this.observers.clear();this.elementStates=new WeakMap;if(this.classMutationObserver){this.classMutationObserver.disconnect();this.classMutationObserver=null;}if(this.scrollElements.size>0){window.removeEventListener("scroll",this.boundScrollHandler);this.scrollElements.clear();}}observeClassChanges(element){if(!this.classMutationObserver){this.classMutationObserver=new MutationObserver((mutations=>{mutations.forEach((mutation=>{if(mutation.type==="attributes"&&mutation.attributeName==="class"){const element=mutation.target;const classes=Array.from(element.classList);classes.forEach((className=>{if(className.startsWith(this.config.baseTriggerClass)){const config=this.parseObserverClass(className);if("add"===config.action&&!element.classList.contains(config.class)){this.setupObserver(element,className);}else if("remove"===config.action&&element.classList.contains(config.class)){this.setupObserver(element,className);}}}));}}));}));}this.classMutationObserver.observe(element,{attributes:true,attributeFilter:["class"]});}setupScrolls(event){const element=event.detail.element;if(event.detail.isIntersecting&&element.classList.contains(this.config.baseScrollClass)){if(!element._initialTriggerPosition){element._initialTriggerPosition=element.getBoundingClientRect().top;}const currentOffset=element.style.getPropertyValue("--observe-scroll-offset");if(currentOffset){element._lastKnownOffset=parseFloat(currentOffset);}this.scrollElements.add(element);element.classList.add(this.config.baseScrollingClass);if(this.scrollElements.size===1){window.addEventListener("scroll",this.boundScrollHandler,{passive:true});}}else if(!event.detail.isIntersecting&&element.classList.contains(this.config.baseScrollClass)){const currentOffset=element.style.getPropertyValue("--observe-scroll-offset");if(currentOffset){element._lastKnownOffset=parseFloat(currentOffset);}element.classList.remove(this.config.baseScrollingClass);this.scrollElements.delete(element);if(this.scrollElements.size===0){window.removeEventListener("scroll",this.boundScrollHandler);}}}handleScroll(){requestAnimationFrame((()=>{for(const element of this.scrollElements){if(element&&element.isConnected){const currentPosition=Math.round(element.getBoundingClientRect().top);const scrollOffset=Math.round(element._initialTriggerPosition-currentPosition);if(element._lastKnownOffset!==undefined){const offsetDifference=Math.round(scrollOffset-element._lastKnownOffset);element.style.setProperty(this.config.scrollOffsetProperty,element._lastKnownOffset+offsetDifference);}else {element.style.setProperty(this.config.scrollOffsetProperty,scrollOffset);}}else {this.scrollElements.delete(element);}}}));}}

	/**
	 * Determine the height of the admin bar if it is output.
	 *
	 * @type {number}
	 */
	const adminBarHeight = observeTriggersConfig.hasAdminBar
		? document.getElementById('wpadminbar')?.offsetHeight || 0
		: 0;

	/**
	 * Create the triggers instance with initial config.
	 *
	 * @type {ObserveTriggers}
	 */
	const triggers = new ObserveTriggers({
		offsetTop: adminBarHeight,
	});

	/**
	 * Manage the ObserveTriggers offset when the window is resized
	 * and the admin bar height has changed.
	 */
	window.addEventListener('resize', () => {
		const newHeight = observeTriggersConfig.hasAdminBar
			? document.getElementById('wpadminbar')?.offsetHeight || 0
			: 0;

		if (newHeight !== triggers.config.offsetTop) {
			const currentObservers = new Map(triggers.observers);

			// Update the current configuration.
			triggers.config.offsetTop = newHeight;

			// Disconnect all existing observers.
			triggers.destroy();

			// Reinitialize the triggers instance.
			triggers.init();

			/**
			 * Restore existing observers for the observer IDs skipped in the new
			 * init() process.
			 */
			currentObservers.forEach((observers, element) => {
				observers.forEach((observer, className) => {
					triggers.setupObserver(element, className);
				});
			});
		}
	});

})();
