const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Función para manejar errores de respuesta
export async function handleResponse(response: Response) {
  if (response.status === 204) {
    // No Content, no hay error
    return;
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw error || { message: 'Error desconocido' };
  }
  return response.json();
}

// Auth
export const register = async (userData: { name: string; email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const login = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const logout = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

// CRUD para Companies
export const getCompanies = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getCompanyById = async (companyId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
    method: 'GET',
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
  console.log('URL:', `${import.meta.env.VITE_API_BASE_URL}/companies`); // Verificar la URL
  console.log('Datos enviados al backend:', companyData); // Verificar los datos enviados
  console.log('Token enviado:', token); // Verificar el token

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(companyData),
  });

  console.log('Estado de la respuesta:', response.status); // Verificar el código de estado HTTP
  console.log('Respuesta completa:', response); // Verificar la respuesta completa

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error del servidor:', errorData); // Verificar el error del servidor
    throw new Error(errorData.message || 'Error al crear la compañía');
  }

  return response.json();
};

export const updateCompany = async (companyId: number, companyData: { name: string; address: string }, token: string) => {
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(companyData),
  });
  return handleResponse(response);
};

export const deleteCompany = async (companyId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

// CRUD para Users
export const getUsers = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getUserById = async (userId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};
export const me = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const createUser = async (userData: { name: string; email: string; password: string }, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const updateUser = async (userId: number, userData: { name: string; email: string }, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const deleteUser = async (userId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

// CRUD para Roles
export const getRoles = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/roles`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const createRole = async (roleData: { name: string }, token: string) => {
  const response = await fetch(`${API_BASE_URL}/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(roleData),
  });
  return handleResponse(response);
};

export const updateRole = async (roleId: number, roleData: { name: string }, token: string) => {
  const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(roleData),
  });
  return handleResponse(response);
};

export const deleteRole = async (roleId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

// Asignar, actualizar y eliminar roles de usuarios
export const assignRoleToUser = async (userId: number, roleId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/assign-role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role_id: roleId }),
  });
  return handleResponse(response);
};

export const updateUserRole = async (userId: number, roleId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/update-role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role_id: roleId }),
  });
  return handleResponse(response);
};

export const deleteUserRole = async (userId: number, roleId: number, token: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/delete-role`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role_id: roleId }),
  });
  return handleResponse(response);
};

// CRUD para Clients
export const getClients = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  };
  
  export const getClientById = async (clientId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  };
  
  export const createClient = async (clientData: { name: string; email: string }, token: string) => {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });
    return handleResponse(response);
  };
  
  export const updateClient = async (clientId: number, clientData: { name: string; email: string }, token: string) => {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });
    return handleResponse(response);
  };
  
  export const deleteClient = async (clientId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  };
  
  // CRUD para Invoices
  export const getInvoices = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  };
  
  export const getInvoiceById = async (invoiceId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  };
  
  export interface InvoicePayload {
  company_id: number;
  user_id: number;
  client_id: number;
  items: { id: number; quantity: number; price: number }[];
  custom_items?: { description: string; quantity: number; unit_price: number }[];
  taxes: number[];
  date: string;
  operation_date?: string;
  total: number;
}

export const createInvoice = async (invoiceData: InvoicePayload, token: string) => {
  const response = await fetch(`${API_BASE_URL}/invoices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(invoiceData),
  });
  return handleResponse(response);
};
  export const updateInvoice = async (invoiceId: number, invoiceData: { client_id: number; items: object[] }, token: string) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invoiceData),
    });
    return handleResponse(response);
  };
  
  export const deleteInvoice = async (invoiceId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  };
  
  // CRUD para Items
  export const getItems = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  };
  
  export const getItemById = async (itemId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
      method: 'GET',
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
  if (!response.ok) throw new Error('Error al obtener los ítems');
  return response.json();
};
  
  export const createItem = async (itemData: { name: string; price: number }, token: string) => {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });
  return handleResponse(response);
};
  
  export const deleteItem = async (itemId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  };
  
  // CRUD para Taxes
  export const getTaxes = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/taxes`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  };
  
  export const getTaxById = async (taxId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/taxes/${taxId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  };
  
  export const createTax = async (taxData: { name: string; percentage: number }, token: string) => {
    const response = await fetch(`${API_BASE_URL}/taxes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taxData),
    });
    return handleResponse(response);
  };
  
  export const updateTax = async (taxId: number, taxData: { name: string; percentage: number }, token: string) => {
    const response = await fetch(`${API_BASE_URL}/taxes/${taxId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taxData),
    });
    return handleResponse(response);
  };
  
  export const deleteTax = async (taxId: number, token: string) => {
    const response = await fetch(`${API_BASE_URL}/taxes/${taxId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(response);
  };