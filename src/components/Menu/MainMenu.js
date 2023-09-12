import {dataState, useStoreTab} from "@/context/states";
import {useState} from "react";
import {Dropdown} from "antd";

export default function MainMenu({title, data}) {
    const { setNewTab } = useStoreTab();
    return (
        <Dropdown
            menu={{
                items:data,
                onClick: (d)=>setNewTab(d.key)
            }}
            placement="bottom"
        >
            <span className={`border-gray-500 border-r hover:bg-[#85d3ff] hover:cursor-pointer px-4`}>{title}</span>
        </Dropdown>
    )
}