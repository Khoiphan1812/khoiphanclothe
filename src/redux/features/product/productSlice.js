import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productApis } from "../../../apis/productsAPI";

const initialState = {
  hotProducts: [],
  newProducts: [],
  saleProducts: [],
  shirtProducts: [],
  pantProducts: [],
  accessoryProducts: [],
  shoeProducts: [],
  isLoading: false,
  error: null,
  productDetails: null,
  relatedProducts: [],
  selectedColor: "",
  selectedSize: "",
  selectedImage: "",
  averageRatings: {},
  searchResults: [],
  pagination: {
    currentPage: 1,
    productsPerPage: 12,
    total: 12,
  },
  sortType: "default",
};

export const fetchHotProducts = createAsyncThunk(
  "products/fetchHotProducts",
  async (params = {}) => {
    const response = await productApis.getAllProducts({
      ...params,
      tags: "hot",
    });
    if (Array.isArray(response.data)) {
      return {
        data: response.data.filter(
          (product) => product.tags && product.tags.includes("hot")
        ),
        total: response.headers.get("X-Total-Count"),
      };
    } else {
      console.error("Data is not an array or is empty:", response.data);
      return { data: [], total: 0 }; // Return empty data structure as fallback
    }
  }
);

export const fetchSaleProducts = createAsyncThunk(
  "products/fetchSaleProducts",
  async (params = {}, thunkAPI) => {
    const sortType = thunkAPI.getState().products.sortType;
    const response = await productApis.getAllProducts({
      ...params,
      tags: "sale",
      _sort: sortType,
    });
    if (Array.isArray(response.data)) {
      return {
        data: response.data.filter(
          (product) => product.tags && product.tags.includes("sale")
        ),
        total: response.headers.get("X-Total-Count"),
      };
    } else {
      console.error("Data is not an array or is empty:", response.data);
      return { data: [], total: 0 }; // Return empty data structure as fallback
    }
  }
);

export const fetchNewProducts = createAsyncThunk(
  "products/fetchNewProducts",
  async (params = {}, thunkAPI) => {
    const sortType = thunkAPI.getState().products.sortType;
    const response = await productApis.getAllProducts({
      ...params,
      tags: "new",
      _sort: sortType,
    });
    if (Array.isArray(response.data)) {
      return {
        data: response.data.filter(
          (product) => product.tags && product.tags.includes("new")
        ),
        total: response.headers.get("X-Total-Count"),
      };
    } else {
      console.error("Data is not an array or is empty:", response.data);
      return { data: [], total: 0 }; // Return empty data structure as fallback
    }
  }
);

// Async thunk to fetch product details
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (productId) => {
    const response = await productApis.getProductById(productId);
    return response;
  }
);

// Async thunk to fetch related products
export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelatedProducts",
  async (subcategory) => {
    const allProducts = await productApis.getAllProducts();
    return allProducts.filter((product) => product.subcategory === subcategory);
  }
);

// Async thunk to fetch shirts based on category
export const fetchShirtsByCategory = createAsyncThunk(
  "products/fetchShirtsByCategory",
  async ({ categoryQuery = "all", _page = 1, _limit = 12 }, { getState }) => {
    // Construct query parameters
    const state = getState();
    const { productsPerPage } = state.products.pagination;
    let queryParams = {
      category: "shirt",
      _limit: productsPerPage || _limit, // Use productsPerPage from state or fallback to _limit
      _page: _page,
    };
    if (categoryQuery !== "all") {
      queryParams.subcategory = categoryQuery;
    }

    // Make the API call with the query parameters
    const response = await productApis.getAllProducts(queryParams);

    // Return the response data and total count
    return {
      data: response.data,
      total: response.headers.get("X-Total-Count"),
    };
  }
);

// Async thunk to fetch pants based on category
export const fetchPantsByCategory = createAsyncThunk(
  "products/fetchPantsByCategory",
  async ({ categoryQuery = "all", _page = 1, _limit = 12 }, { getState }) => {
    // Construct query parameters
    const state = getState();
    const { productsPerPage } = state.products.pagination;
    let queryParams = {
      category: "pant",
      _limit: productsPerPage || _limit, // Use productsPerPage from state or fallback to _limit
      _page: _page,
    };
    if (categoryQuery !== "all") {
      queryParams.subcategory = categoryQuery;
    }

    // Make the API call with the query parameters
    const response = await productApis.getAllProducts(queryParams);

    // Return the response data and total count
    return {
      data: response.data,
      total: response.headers.get("X-Total-Count"),
    };
  }
);

// Async thunk to fetch accessory based on category
export const fetchAccessorysByCategory = createAsyncThunk(
  "products/fetchAccessorysByCategory",
  async ({ categoryQuery = "all", _page = 1, _limit = 12 }, { getState }) => {
    // Construct query parameters
    const state = getState();
    const { productsPerPage } = state.products.pagination;
    let queryParams = {
      category: "accessory",
      _limit: productsPerPage || _limit, // Use productsPerPage from state or fallback to _limit
      _page: _page,
    };
    if (categoryQuery !== "all") {
      queryParams.subcategory = categoryQuery;
    }

    // Make the API call with the query parameters
    const response = await productApis.getAllProducts(queryParams);

    // Return the response data and total count
    return {
      data: response.data,
      total: response.headers.get("X-Total-Count"),
    };
  }
);

// Async thunk to fetch pants based on category
export const fetchShoesByCategory = createAsyncThunk(
  "products/fetchShoesByCategory",
  async ({ categoryQuery = "all", _page = 1, _limit = 12 }, { getState }) => {
    // Construct query parameters
    const state = getState();
    const { productsPerPage } = state.products.pagination;
    let queryParams = {
      category: "shoe",
      _limit: productsPerPage || _limit, // Use productsPerPage from state or fallback to _limit
      _page: _page,
    };
    if (categoryQuery !== "all") {
      queryParams.subcategory = categoryQuery;
    }

    // Make the API call with the query parameters
    const response = await productApis.getAllProducts(queryParams);

    // Return the response data and total count
    return {
      data: response.data,
      total: response.headers.get("X-Total-Count"),
    };
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await productApis.searchProducts(searchTerm);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedColor: (state, action) => {
      state.selectedColor = action.payload;
    },
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
    },
    setAverageRating: (state, action) => {
      const { productId, averageRating } = action.payload;
      state.averageRatings[productId] = averageRating;
    },
    setSortedProducts: (state, action) => {
      const { sortType, productType } = action.payload;
      let productsToSort = [];

      if (productType === "newProducts") {
        productsToSort = [...state.newProducts];
      } else if (productType === "saleProducts") {
        productsToSort = [...state.saleProducts];
      } else if (productType === "shirtProducts") {
        productsToSort = [...state.shirtProducts];
      } else if (productType === "pantProducts") {
        productsToSort = [...state.pantProducts];
      } else if (productType === "accessoryProducts") {
        productsToSort = [...state.accessoryProducts];
      } else if (productType === "shoeProducts") {
        productsToSort = [...state.shoeProducts];
      }

      switch (sortType) {
        case "default":
          productsToSort.sort((a, b) => a.id.localeCompare(b.id));
          break;
        case "priceLowHigh":
          productsToSort.sort(
            (a, b) => parseFloat(a.price) - parseFloat(b.price)
          );
          break;
        case "priceHighLow":
          productsToSort.sort(
            (a, b) => parseFloat(b.price) - parseFloat(a.price)
          );
          break;
        default:
          break;
      }

      // Cập nhật lại trạng thái với mảng đã sắp xếp
      if (productType === "newProducts") {
        state.newProducts = productsToSort;
      } else if (productType === "saleProducts") {
        state.saleProducts = productsToSort;
      } else if (productType === "shirtProducts") {
        state.shirtProducts = productsToSort;
      } else if (productType === "pantProducts") {
        state.pantProducts = productsToSort;
      } else if (productType === "accessoryProducts") {
        state.accessoryProducts = productsToSort;
      } else if (productType === "shoeProducts") {
        state.shoeProducts = productsToSort;
      }
    },
    goToPage: (state, action) => {
      state.pagination = {
        ...state.pagination,
        currentPage: action.payload,
      }; // set current page
    },
    setSortType: (state, action) => {
      state.sortType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHotProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload.data)) {
          state.hotProducts = action.payload.data; // Assuming data is an array of products
          state.pagination.totalProducts = action.payload.total;
        } else {
          console.error("Invalid data structure:", action.payload.data);
          state.hotProducts = []; // Reset to empty array as a fallback
          state.pagination.totalProducts = 0;
        }
      })
      .addCase(fetchHotProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSaleProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSaleProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload.data)) {
          state.saleProducts = action.payload.data; // Assuming data is an array of products
          state.pagination.totalProducts = action.payload.total;
        } else {
          console.error("Invalid data structure:", action.payload.data);
          state.saleProducts = []; // Reset to empty array as a fallback
          state.pagination.totalProducts = 0;
        }
      })
      .addCase(fetchSaleProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchNewProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNewProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload.data)) {
          state.newProducts = action.payload.data; // Assuming data is an array of products
          state.pagination.totalProducts = action.payload.total;
        } else {
          console.error("Invalid data structure:", action.payload.data);
          state.newProducts = []; // Reset to empty array as a fallback
          state.pagination.totalProducts = 0;
        }
      })
      .addCase(fetchNewProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
      })
      .addCase(fetchShirtsByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShirtsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload.data)) {
          state.shirtProducts = action.payload.data; // Assuming data is an array of products
          state.pagination.totalProducts = action.payload.total;
        } else {
          console.error("Invalid data structure:", action.payload.data);
          state.shirtProducts = []; // Reset to empty array as a fallback
          state.pagination.totalProducts = 0;
        }
      })
      .addCase(fetchShirtsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPantsByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPantsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload.data)) {
          state.pantProducts = action.payload.data; // Assuming data is an array of products
          state.pagination.totalProducts = action.payload.total;
        } else {
          console.error("Invalid data structure:", action.payload.data);
          state.pantProducts = []; // Reset to empty array as a fallback
          state.pagination.totalProducts = 0;
        }
      })
      .addCase(fetchPantsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAccessorysByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAccessorysByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload.data)) {
          state.accessoryProducts = action.payload.data; // Assuming data is an array of products
          state.pagination.totalProducts = action.payload.total;
        } else {
          console.error("Invalid data structure:", action.payload.data);
          state.accessoryProducts = []; // Reset to empty array as a fallback
          state.pagination.totalProducts = 0;
        }
      })
      .addCase(fetchAccessorysByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchShoesByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShoesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload.data)) {
          state.shoeProducts = action.payload.data; // Assuming data is an array of products
          state.pagination.totalProducts = action.payload.total;
        } else {
          console.error("Invalid data structure:", action.payload.data);
          state.shoeProducts = []; // Reset to empty array as a fallback
          state.pagination.totalProducts = 0;
        }
      })
      .addCase(fetchShoesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchResults = action.payload; // Cập nhật trạng thái với kết quả tìm kiếm
      });
  },
});

export const {
  setSelectedColor,
  setSelectedSize,
  setSelectedImage,
  setSortedProducts,
  setAverageRating,
  goToPage,
  setSortType,
} = productSlice.actions;

export default productSlice.reducer;
