export interface Category {
  id: string
  name: string
  group: string // ¡La clave para organizar!
}

export const ALL_CATEGORIES: Category[] = [
 
  // ==============================================
  // 👗 MODA Y ACCESORIOS (Ojo con la nota de tallas)
  // ==============================================
  { id: 'cat_ropa_dama', name: 'Ropa para Dama', group: 'Moda y Accesorios' },
  { id: 'cat_ropa_caballero', name: 'Ropa para Caballero', group: 'Moda y Accesorios' },
  { id: 'cat_ropa_bebe', name: 'Ropa Infantil y Bebés', group: 'Moda y Accesorios' },
  { id: 'cat_zapatos', name: 'Calzado y Tenis', group: 'Moda y Accesorios' },
  { id: 'cat_mochilas', name: 'Mochilas y Equipaje', group: 'Moda y Accesorios' }, // Mochilas
  { id: 'cat_joyeria', name: 'Joyería y Relojes', group: 'Moda y Accesorios' },
  { id: 'cat_lentes', name: 'Lentes y Gafas', group: 'Moda y Accesorios' },
  { id: 'cat_deportes_ropa', name: 'Ropa Deportiva', group: 'Moda y Accesorios' },

  // ==============================================
  // 🎸 MÚSICA, HOBBIES Y ENTRETENIMIENTO
  // ==============================================
  { id: 'cat_discos', name: 'Discos, Vinilos y Música', group: 'Entretenimiento' }, // Discos
  { id: 'cat_instrumentos', name: 'Instrumentos Musicales', group: 'Entretenimiento' },
  { id: 'cat_videojuegos', name: 'Videojuegos y Consolas', group: 'Entretenimiento' },
  { id: 'cat_juguetes', name: 'Juguetes y Coleccionables', group: 'Entretenimiento' },
  { id: 'cat_libros', name: 'Libros y Revistas', group: 'Entretenimiento' },
  { id: 'cat_arte', name: 'Arte y Manualidades', group: 'Entretenimiento' },
  { id: 'cat_papeleria', name: 'Papelería y Oficina', group: 'Entretenimiento' },

  // ==============================================
  // 🏠 Otros
  // ==============================================
  
  { id: 'cat_varios', name: 'Otros / Varios', group: 'Otros' },
]
