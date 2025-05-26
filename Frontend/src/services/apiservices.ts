const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Función para manejar errores de respuesta
export async function handleResponse(response: Response) {
  if (response.status === 204) {
    // No Content, no hay error
    return;
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw error || { message: "Error desconocido" };
  }
  return response.json();
}

// Auth
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const logout = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

// CRUD para Companies
export const getCompanies = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};
export async function getMyCompanies(token: string) {
  const res = await fetch(`${API_BASE_URL}/my-companies`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export const getCompanyById = async (companyId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const createCompany = async (
  companyData: {
    name: string;
    legal_name?: string;
    cif: string;
    email: string;
    telefono?: string;
    fiscal_address?: string;
    social_address?: string;
    city?: string;
    postal_code?: string;
    province?: string;
    invoice_prefix?: string;
  },
  token: string
) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("URL:", `${API_BASE_URL}/companies`);
  console.log("Datos enviados al backend:", companyData);
  console.log("Token enviado:", token);

  const res = await fetch(`${API_BASE_URL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(companyData),
  });

  // Guarda el status y content-type antes de consumir el body
  const contentType = res.headers.get("content-type");
  const status = res.status;

  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    // Si no es JSON, probablemente es HTML (error de autenticación/redirección)
    const text = await res.text();
    console.error("Respuesta no JSON:", text);
    throw new Error("Respuesta no es JSON. ¿Token inválido o ruta incorrecta?");
  }

  console.log("Estado de la respuesta:", status);
  console.log("Respuesta completa:", data);

  if (!res.ok) {
    // Si el backend devuelve error, muestra el mensaje
    throw new Error(data.message || data.error || "Error al crear la compañía");
  }

  return data;
};

export const updateCompany = async (
  companyId: number,
  companyData: any,
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(companyData),
  });
  if (!response.ok) throw new Error("Error al actualizar la compañía");
  return response.json();
};

export const deleteCompany = async (companyId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getAllCompanies = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/companies`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al obtener todas las compañías");
  return response.json();
};

// CRUD para Users
export const getUsers = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getUserById = async (userId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const me = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const createUser = async (
  userData: { name: string; email: string; password: string },
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const updateUser = async (
  userId: number,
  userData: { name: string; email: string },
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const deleteUser = async (userId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const registerWorker = async (form: any, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/register-worker`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al registrar trabajador");
  }
  return response.json();
};

// CRUD para Roles
export const getRoles = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/roles`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const createRole = async (roleData: { name: string }, token: string) => {
  const response = await fetch(`${API_BASE_URL}/roles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(roleData),
  });
  return handleResponse(response);
};

export const updateRole = async (
  roleId: number,
  roleData: { name: string },
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(roleData),
  });
  return handleResponse(response);
};

export const deleteRole = async (roleId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

// Asignar, actualizar y eliminar roles de usuarios
export const assignRoleToUser = async (
  userId: number,
  roleId: number,
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/assign-role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role_id: roleId }),
  });
  return handleResponse(response);
};

export const updateUserRole = async (
  userId: number,
  roleId: number,
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/update-role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role_id: roleId }),
  });
  return handleResponse(response);
};

export const deleteUserRole = async (
  userId: number,
  roleId: number,
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/delete-role`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role_id: roleId }),
  });
  return handleResponse(response);
};

// CRUD para Clients
export const getClients = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getClientById = async (clientId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getClientsByCompany = async (companyId: number, token: string) => {
  const response = await fetch(
    `${API_BASE_URL}/companies/${companyId}/clients`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return handleResponse(response);
};
export const createClient = async (
  clientData: { name: string; email: string },
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clientData),
  });
  return handleResponse(response);
};

export const updateClient = async (
  clientId: number,
  clientData: any,
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clientData),
  });
  if (!response.ok) throw new Error("Error al actualizar el cliente");
  return response.json();
};

export const deleteClient = async (clientId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al eliminar el cliente");
  return response;
};
export const getAllClients = async (token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/clients`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Error al obtener los clientes");
  return response.json();
};

// CRUD para Invoices
export const getInvoices = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/invoices`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};
export const getAllInvoices = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/invoices`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al obtener las facturas");
  return response.json();
};

export const getInvoiceById = async (invoiceId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getInvoicesByCompany = async (
  companyId: number,
  token: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/companies/${companyId}/invoices`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return handleResponse(response);
};

export interface InvoicePayload {
  company_id: number;
  user_id: number;
  client_id: number;
  number: string; // <-- Ahora obligatorio para update
  items: { id: number; quantity: number; price: number }[];
  custom_items?: {
    description: string;
    quantity: number;
    unit_price: number;
  }[];
  taxes: number[];
  date: string;
  operation_date?: string;
  total: number;
}

export const createInvoice = async (
  invoiceData: InvoicePayload,
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(invoiceData),
  });
  return handleResponse(response);
};

export const updateInvoice = async (
  invoiceId: number,
  invoiceData: InvoicePayload,
  token: string
) => {
  // Asegúrate de que client_id y number están presentes y válidos
  if (!invoiceData.client_id || !invoiceData.number) {
    throw new Error("El payload debe incluir client_id y number");
  }
  const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(invoiceData),
  });
  if (!response.ok) throw new Error("Error al actualizar la factura");
  return response.json();
};

export const deleteInvoice = async (invoiceId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export async function createPrintedInvoices(
  invoiceIds: number[],
  token: string
) {
  const response = await fetch(`${API_BASE_URL}/printed-invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ invoice_ids: invoiceIds }),
  });
  if (!response.ok) throw new Error("Error al registrar impresiones");
  return response.json();
}
export async function getPrintedInvoices(token: string) {
  const response = await fetch(`${API_BASE_URL}/printed-invoices`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al obtener impresiones");
  return response.json();
}

export async function getPrintedInvoiceById(id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/printed-invoices/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al obtener impresión");
  return response.json();
}
export async function deletePrintedInvoice(id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/printed-invoices/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    let errorMsg = "Error al eliminar la factura impresa";
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || JSON.stringify(errorData) || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return await response.json();
}

// CRUD para Items
export const getItems = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};
export const getAllItems = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/admin/items`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Error al obtener los ítems");
  return response.json();
};

export const getItemById = async (itemId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};
export const getItemsByCompany = async (companyId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}/items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al obtener los ítems");
  return response.json();
};

export const createItem = async (
  itemData: { name: string; price: number },
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });
  return handleResponse(response);
};

export const updateItem = async (
  itemId: number,
  itemData: { name?: string; description?: string; price?: number },
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });
  return handleResponse(response);
};

export const deleteItem = async (itemId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

// CRUD para Taxes
export const getTaxes = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/taxes`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getTaxById = async (taxId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/taxes/${taxId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const createTax = async (
  taxData: { name: string; percentage: number },
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/taxes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json", // <-- Añade esto
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taxData),
  });
  return handleResponse(response);
};

export const updateTax = async (
  taxId: number,
  taxData: { name: string; percentage: number },
  token: string
) => {
  const response = await fetch(`${API_BASE_URL}/taxes/${taxId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taxData),
  });
  return handleResponse(response);
};

export const deleteTax = async (taxId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/taxes/${taxId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};
