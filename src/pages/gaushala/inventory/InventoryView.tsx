import React, { useEffect, useState } from "react";
import getInventoryById, { Inventory, inventoryApi } from '../../../services/gaushala/api';

export default function InventoryDetails({ id }: { id: number }) {
    const [inventory, setInventory] = useState<Inventory | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await inventoryApi.getInventoryById(id);
            if (result.success && result.data) {
                setInventory(result.data);
            } else {
                setError(result.error || "Failed to fetch inventory");
            }
            setLoading(false);
        };

        fetchData();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div>
            <h2>Inventory Details</h2>
            {inventory ? (
                <div>
                    <p><strong>ID:</strong> {inventory.id}</p>
                    <p><strong>Name:</strong> {inventory.itemName}</p>
                    <p><strong>Quantity:</strong> {inventory.quantity}</p>
                    <p><strong>Unit:</strong> {inventory.inventoryUnitId}</p>
                    <p><strong>Type:</strong> {inventory.inventoryTypeId}</p>
                    <p><strong>Minimum Stock Level:</strong> {inventory.minimumStockLevel || 0}</p>
                    <p><strong>Supplier:</strong> {inventory.supplier}</p>
                    <p><strong>GaushalaId:</strong> {inventory.gaushalaId}</p>
                    <p><strong>CreatedAt:</strong> {inventory.createdAt}</p>
                </div>
            ) : (
                <p>No inventory data found.</p>
            )}
        </div>
    );
}

