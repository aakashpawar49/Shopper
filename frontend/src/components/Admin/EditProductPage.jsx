import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { fetchProductDetails } from "../../redux/slices/productSlice";
import { updateProduct } from "../../redux/slices/adminProductSlice";
import api, { getErrorMessage } from "../../lib/api";
import PageLoader from "../Common/PageLoader";

const EMPTY_PRODUCT = {
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
};

// Turns "S, M, L" into ["S", "M", "L"]
const toList = (value) => value.split(",").map((item) => item.trim());

const EditProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const productDetails = useSelector((state) => state.products.productDetails);
    const detailsError = useSelector((state) => state.products.detailsError);
    const [productData, setProductData] = useState(EMPTY_PRODUCT);
    const [loadedId, setLoadedId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id) return undefined;
        const request = dispatch(fetchProductDetails(id));
        return () => request.abort();
    }, [dispatch, id]);

    // Copy the fetched product into the form once (ignoring details left over
    // from another product)
    if (productDetails?._id === id && loadedId !== id) {
        setLoadedId(id);
        setProductData({ ...EMPTY_PRODUCT, ...productDetails });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);

        setUploading(true);
        try {
            const { data } = await api.post("/api/upload", formData, { requiresAuth: true });
            setProductData((prev) => ({
                ...prev,
                images: [...prev.images, { url: data.imageUrl, altText: "" }],
            }));
        } catch (error) {
            toast.error(`Image upload failed: ${getErrorMessage(error)}`);
        } finally {
            setUploading(false);
        }
    };

    // Wait for the save to succeed before leaving the page
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await dispatch(updateProduct({ id, productData })).unwrap();
            toast.success("Product updated");
            navigate("/admin/products");
        } catch (error) {
            toast.error(`Couldn't save the product: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (detailsError && loadedId !== id) return <p className="text-red-600">Error: {detailsError}</p>;
    if (loadedId !== id) return <PageLoader />;

    return (
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="mb-6 text-3xl font-bold">Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="name" className="label">Product Name</label>
                    <input id="name" type="text" name="name" value={productData.name} onChange={handleChange} className="input" required />
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        className="input"
                        rows={4}
                        required
                    />
                </div>

                <div className="mb-6 grid gap-6 sm:grid-cols-3">
                    <div>
                        <label htmlFor="price" className="label">Price</label>
                        <input id="price" type="number" name="price" value={productData.price} onChange={handleChange} className="input" />
                    </div>
                    <div>
                        <label htmlFor="countInStock" className="label">Count In Stock</label>
                        <input
                            id="countInStock"
                            type="number"
                            name="countInStock"
                            value={productData.countInStock}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div>
                        <label htmlFor="sku" className="label">SKU</label>
                        <input id="sku" type="text" name="sku" value={productData.sku} onChange={handleChange} className="input" />
                    </div>
                </div>

                <div className="mb-6 grid gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="sizes" className="label">Sizes (comma-separated)</label>
                        <input
                            id="sizes"
                            type="text"
                            name="sizes"
                            value={productData.sizes.join(", ")}
                            onChange={(e) => setProductData((prev) => ({ ...prev, sizes: toList(e.target.value) }))}
                            className="input"
                        />
                    </div>
                    <div>
                        <label htmlFor="colors" className="label">Colors (comma-separated)</label>
                        <input
                            id="colors"
                            type="text"
                            name="colors"
                            value={productData.colors.join(", ")}
                            onChange={(e) => setProductData((prev) => ({ ...prev, colors: toList(e.target.value) }))}
                            className="input"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="image" className="label">Upload Image</label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-sm file:mr-4 file:rounded-full file:border-0 file:bg-gray-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-rabbit-red"
                    />
                    {uploading && <p className="mt-2 animate-pulse text-sm text-gray-500">Uploading image…</p>}
                    <div className="mt-4 flex flex-wrap gap-4">
                        {productData.images.map((image) => (
                            <img
                                key={image.url}
                                src={image.url}
                                alt={image.altText || "Product image"}
                                className="h-20 w-20 animate-scale-in rounded-lg object-cover shadow-md"
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving || uploading}
                    className="w-full rounded-full bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                    {saving ? "Saving…" : "Update Product"}
                </button>
            </form>
        </div>
    );
};

export default EditProductPage;
