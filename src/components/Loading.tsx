import React from "react";

export default function Loading() {
    return (
        <div style={{
            position: "fixed",
            zIndex: "999999",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: `rgba(0,0,0,${"0.65"})`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <h3 style={{ color: "#fff", fontSize: 24 }}>Loading...</h3>
        </div>
    )
}