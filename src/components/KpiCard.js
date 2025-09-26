import React from "react";
import { Button, Card } from "react-bootstrap";

function KpiCard({
    title,
    value,
    icon: Icon,
    color = "#673ab7",
    gradient = "#512da8",
    path
}) {
    return (
        <Card
            style={{
                background: `linear-gradient(135deg, ${color}, ${gradient})`,
                borderRadius: "15px",
                color: "white",
                padding: "20px",
                position: "relative",
                overflow: "hidden",
                minWidth: "220px",
                border: 'none'
            }}
        >
            {/* วงกลม background */}
            <div
                style={{
                    position: "absolute",
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    top: "-40px",
                    right: "-40px",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.05)",
                    top: "20px",
                    right: "20px",
                }}
            />

            <div className="d-flex justify-content-between align-items-start">
                {/* ไอคอนซ้าย */}
                <div
                    style={{
                        background: "rgba(0,0,0,0.2)",
                        borderRadius: "10px",
                        padding: "10px",
                        display: "inline-flex",
                    }}
                >
                    {Icon && <Icon size={20} />}
                </div>

                {/* เมนูขวา */}
                {path && (
                    <Button
                        style={{
                            background: "rgba(255, 255, 255, 0.2)",
                            borderRadius: "10px",
                            padding: "6px 12px",
                            border: "none",
                            color: "white",
                            fontWeight: "500",
                            position: "relative",  
                            zIndex: 20
                        }}
                        onClick={() => window.location.href = path}
                    >
                        รายละเอียด
                    </Button>
                )}
            </div>

            {/* ข้อความ */}
            <h4 style={{ marginTop: "20px" }}>{value}</h4>
            <small>{title}</small>
        </Card>
    );
}

export default KpiCard;
