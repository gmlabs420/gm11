"use client"
import { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";

export default function AboutAccordion6() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="accordion-section">
            <button onClick={() => isOpen ? setIsOpen(false) : setIsOpen(true)} className="accordion">
                <h1>Thirdweb</h1>
                {isOpen ? (
                    <ChevronUpIcon className="h-20 chevron-icon" />
                ) : (
                    <ChevronDownIcon className="h-20 chevron-icon" />
                )}
            </button>
            <div className={(isOpen ? "visible max-h-auto " : "invisible max-h-0 ") + "panel"}>
            <h1>What is a GM?!</h1>
            <p>A GM is a Good Morning. We all love a Good Morning. We celvrate it by saying GM. GM to ourselves. GM to each other. GM to the world. </p>


            </div>
        </div>
    );
}
