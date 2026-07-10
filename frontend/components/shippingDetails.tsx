"use client";

import { useShipping } from "@/app/contexts/shippingContext";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Address {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  area: string;
  fullAddress: string;
  isDefaultShippingAddress: boolean;
}

const emptyForm = {
  fullName: "",
  phoneNumber: "",
  email: "",
  city: "",
  area: "",
  fullAddress: "",
  isDefaultShippingAddress: false,
};

export default function ShippingDetails() {
  const { addresses, setAddresses, selectedAddressId, setSelectedAddressId } =
    useShipping();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(
        "/api/addresses",
        { credentials: "include" },
      );
      if (!res.ok) return;

      const json = await res.json();
      const data: Address[] = json.data ?? [];
      setAddresses(data);

      if (data.length > 0) {
        const def = data.find((a) => a.isDefaultShippingAddress) ?? data[0];
        selectAddress(def);
      } else {
        selectNew();
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const selectAddress = (address: Address) => {
    setSelectedAddressId(address._id);
    setEditingId(null);
    setForm({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      email: address.email,
      city: address.city,
      area: address.area,
      fullAddress: address.fullAddress,
      isDefaultShippingAddress: address.isDefaultShippingAddress,
    });
  };

  const selectNew = () => {
    setSelectedAddressId("new");
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (address: Address) => {
    setSelectedAddressId(address._id);
    setEditingId(address._id);
    setForm({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      email: address.email,
      city: address.city,
      area: address.area,
      fullAddress: address.fullAddress,
      isDefaultShippingAddress: address.isDefaultShippingAddress,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleDelete = async (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Delete Address?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setDeleting(addressId);
    try {
      const res = await fetch(
        `/api/addresses/${addressId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message ?? "Failed to delete address");
      }

      await Swal.fire({
        icon: "success",
        title: "Address deleted",
        showConfirmButton: false,
        timer: 1200,
      });

      await fetchAddresses();
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Couldn't delete address",
        text: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isEditing = editingId !== null;
      const url = isEditing
        ? `/api/addresses/${editingId}`
        : `/api/addresses`;

      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message ?? "Failed to save address");
      }

      const json = await res.json();
      const saved: Address = json.data;

      await Swal.fire({
        icon: "success",
        title: isEditing ? "Address updated" : "Address saved",
        showConfirmButton: false,
        timer: 1200,
      });

      await fetchAddresses();
      selectAddress(saved);
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Couldn't save address",
        text: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  // Determine if we should show the save button
  const showSaveButton = selectedAddressId === "new" || editingId !== null;

  return (
    <div className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>

      {/* Saved addresses */}
      {!loading && addresses.length > 0 && (
        <div className="flex flex-col gap-2 mb-5">
          <p className="text-sm text-gray-500 mb-1">Saved addresses</p>
          <div className="flex flex-wrap gap-2">
            {addresses.map((address) => (
              <div
                key={address._id}
                onClick={() => selectAddress(address)}
                className={`relative flex flex-col gap-0.5 border rounded-xl px-4 py-2.5 cursor-pointer transition text-sm max-w-xs ${
                  selectedAddressId === address._id
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">
                    {address.fullName}
                  </span>
                  {address.isDefaultShippingAddress && (
                    <span className="text-[10px] uppercase tracking-wide bg-green-700 text-white px-1.5 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <span className="text-gray-500 truncate">
                  {address.area}, {address.city}
                </span>
                <div className="absolute top-1.5 right-2 flex gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(address);
                    }}
                    className="text-xs text-green-700 hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(address._id, e)}
                    disabled={deleting === address._id}
                    className="text-xs text-red-600 hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting === address._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}

            <div
              onClick={selectNew}
              className={`flex items-center justify-center border border-dashed rounded-xl px-4 py-2.5 cursor-pointer transition text-sm font-medium ${
                selectedAddressId === "new"
                  ? "border-green-600 text-green-700 bg-green-50"
                  : "border-gray-300 text-gray-500 hover:border-gray-400"
              }`}
            >
              + New Address
            </div>
          </div>
        </div>
      )}

      {editingId && (
        <p className="text-xs text-amber-600 mb-3">
          Editing saved address — saving will update it in place.
        </p>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          required
          value={form.fullName}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-green-600 sm:col-span-2"
        />
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          required
          value={form.phoneNumber}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-green-600"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-green-600"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          required
          value={form.city}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-green-600"
        />
        <input
          type="text"
          name="area"
          placeholder="Area / Locality"
          required
          value={form.area}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-green-600"
        />
        <textarea
          name="fullAddress"
          placeholder="Full Address"
          rows={3}
          required
          value={form.fullAddress}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-green-600 sm:col-span-2 resize-none"
        />

        <label className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
          <input
            type="checkbox"
            name="isDefaultShippingAddress"
            checked={form.isDefaultShippingAddress}
            onChange={handleChange}
            className="cursor-pointer"
          />
          Set as default shipping address
        </label>
      </div>

      {/* Save button - only shown when adding new or editing existing address */}
      {showSaveButton && (
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-5 bg-green-700 hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg transition cursor-pointer font-medium text-sm"
        >
          {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
        </button>
      )}
    </div>
  );
}
