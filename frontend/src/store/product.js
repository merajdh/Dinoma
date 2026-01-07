import { create } from 'zustand';

const useProductStore = create((set, get) => ({
  products: {},

  setProduct: product =>
    set(state => ({
      products: {
        ...state.products,
        [product.slug]: product,
      },
    })),

  getProductById: slug => get().products[slug],
}));

export { useProductStore };
