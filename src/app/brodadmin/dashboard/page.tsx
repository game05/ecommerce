'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loading';
import Image from 'next/image';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: string;
  size?: string;
};

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  image_url: '',
  stock: 0,
  category: '',
  size: '',
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push('/brodadmin');
          return;
        }
        fetchProducts();
      } catch (error) {
        console.error('Erreur de vérification de session:', error);
        router.push('/brodadmin');
      }
    };

    checkAuth();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      throw new Error('Erreur lors du téléchargement de l\'image: ' + error.message);
    }
  };

  const handleAddProduct = async () => {
    try {
      setLoading(true);
      let imageUrl = newProduct.image_url;

      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage);
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ ...newProduct, image_url: imageUrl }])
        .select()
        .single();

      if (error) throw error;

      setProducts([...products, data]);
      setIsAdding(false);
      setNewProduct(emptyProduct);
      setSelectedImage(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          stock: editingProduct.stock,
          category: editingProduct.category,
          size: editingProduct.size,
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === editingProduct.id ? editingProduct : p
      ));
      setIsEditing(false);
      setEditingProduct(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/brodadmin');
  };

  const ProductForm = ({ data, onChange, onSubmit, onCancel, submitText }: any) => {
    const [formData, setFormData] = useState(data);

    useEffect(() => {
      setFormData(data);
    }, [data]);

    const handleChange = (changes: Partial<typeof formData>) => {
      const newData = { ...formData, ...changes };
      setFormData(newData);
      onChange(newData);
    };

    return (
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prix</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange({ price: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange({ description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange({ stock: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleChange({ category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Taille</label>
            <input
              type="text"
              value={formData.size || ''}
              onChange={(e) => handleChange({ size: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
            />
          </div>
        </div>
        {!editingProduct && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
            />
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            {submitText}
          </button>
        </div>
      </form>
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Panneau d'administration
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Ajouter un produit
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {isAdding && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Ajouter un nouveau produit</h2>
              <ProductForm
                data={newProduct}
                onChange={setNewProduct}
                onSubmit={handleAddProduct}
                onCancel={() => {
                  setIsAdding(false);
                  setNewProduct(emptyProduct);
                  setSelectedImage(null);
                }}
                submitText="Ajouter"
              />
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {products.map((product) => (
                <li key={product.id} className="px-6 py-4">
                  {isEditing && editingProduct?.id === product.id ? (
                    <ProductForm
                      data={editingProduct}
                      onChange={setEditingProduct}
                      onSubmit={handleSave}
                      onCancel={() => {
                        setIsEditing(false);
                        setEditingProduct(null);
                      }}
                      submitText="Enregistrer"
                    />
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 relative">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {product.description}
                        </p>
                        <div className="mt-1 flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            Prix: {product.price}€
                          </span>
                          <span className="text-sm text-gray-500">
                            Stock: {product.stock}
                          </span>
                          {product.size && (
                            <span className="text-sm text-gray-500">
                              Taille: {product.size}
                            </span>
                          )}
                          <span className="text-sm text-gray-500">
                            Catégorie: {product.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
