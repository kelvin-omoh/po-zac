"use client";
import React from 'react';

const Modal = (props) => {
    return (
        <div className={`w-screen absolute h-screen z-[500] top-0 left-0 flex justify-center items-center 
        ${props.blur ? "bg-[rgba(0, 0, 0, 0.4)] backdrop-blur-[15px]" : "bg-blue-950 backdrop-blur-[15px]"} cursor-pointer`}>
            <div id="modal-content" className='bg-[url("/game/wood-bg.jpg")] w-full p-4 rounded-2xl mx-4 sm:mx-0 sm:p-8 cursor-default'>
                {props.children}
            </div>
        </div>
    );
}

export default Modal;
