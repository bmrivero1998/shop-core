export interface Category {
  id: string
  name: string
  group: string // ¡La clave para organizar!
}

export const ALL_CATEGORIES: Category[] = [
  // ==============================================
  // 🍔 ALIMENTOS Y BEBIDAS
  // ==============================================
  { id: 'cat_restaurante', name: 'Comida Preparada / Restaurante', group: 'Alimentos y Bebidas' },
  { id: 'cat_fastfood', name: 'Pizzas, Tacos y Snacks', group: 'Alimentos y Bebidas' },
  { id: 'cat_carniceria', name: 'Carnicería y Embutidos', group: 'Alimentos y Bebidas' }, // Carne fresca
  { id: 'cat_fruteria', name: 'Frutas y Verduras', group: 'Alimentos y Bebidas' },
  { id: 'cat_panaderia', name: 'Panadería y Pastelería', group: 'Alimentos y Bebidas' },
  { id: 'cat_licores', name: 'Vinos y Licores', group: 'Alimentos y Bebidas' },
  { id: 'cat_abarrotes', name: 'Abarrotes y Despensa', group: 'Alimentos y Bebidas' },
  { id: 'cat_dulces', name: 'Dulces y Botanas', group: 'Alimentos y Bebidas' },
  { id: 'cat_cafeteria', name: 'Café y Bebidas Calientes', group: 'Alimentos y Bebidas' },

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
  // 💻 TECNOLOGÍA
  // ==============================================
  { id: 'cat_celulares', name: 'Celulares y Tablets', group: 'Tecnología' },
  { id: 'cat_computo', name: 'Laptops y PC', group: 'Tecnología' },
  { id: 'cat_audio', name: 'Audífonos y Bocinas', group: 'Tecnología' },
  { id: 'cat_gadgets', name: 'Gadgets y Accesorios', group: 'Tecnología' },
  { id: 'cat_camaras', name: 'Fotografía y Video', group: 'Tecnología' },

  // ==============================================
  // 🏠 HOGAR Y JARDÍN
  // ==============================================
  { id: 'cat_muebles', name: 'Muebles', group: 'Hogar' },
  { id: 'cat_decoracion', name: 'Decoración e Iluminación', group: 'Hogar' },
  { id: 'cat_cocina', name: 'Cocina y Electrodomésticos', group: 'Hogar' },
  { id: 'cat_jardin', name: 'Jardinería y Plantas', group: 'Hogar' },
  { id: 'cat_limpieza', name: 'Productos de Limpieza', group: 'Hogar' },
  { id: 'cat_mascotas', name: 'Accesorios para Mascotas', group: 'Hogar' },

  // ==============================================
  // 💄 BELLEZA Y CUIDADO PERSONAL
  // ==============================================
  { id: 'cat_skincare', name: 'Cuidado de la Piel', group: 'Belleza' },
  { id: 'cat_maquillaje', name: 'Maquillaje y Cosméticos', group: 'Belleza' },
  { id: 'cat_perfumes', name: 'Perfumes y Fragancias', group: 'Belleza' },
  { id: 'cat_barberia', name: 'Barbería y Afeitado', group: 'Belleza' },
  { id: 'cat_salud', name: 'Farmacia y Bienestar', group: 'Belleza' },

  // ==============================================
  // 🛠️ SERVICIOS (El fuerte del comercio local)
  // ==============================================
  { id: 'cat_svc_medico', name: 'Médicos y Especialistas', group: 'Servicios' },
  { id: 'cat_svc_estetica', name: 'Estética y Spa', group: 'Servicios' },
  { id: 'cat_svc_oficios', name: 'Oficios (Plomería, Carpintería)', group: 'Servicios' },
  { id: 'cat_svc_talleres', name: 'Mecánica Automotriz', group: 'Servicios' },
  { id: 'cat_svc_clases', name: 'Cursos y Clases', group: 'Servicios' },
  { id: 'cat_svc_eventos', name: 'Organización de Eventos', group: 'Servicios' },
  { id: 'cat_svc_inmobiliaria', name: 'Bienes Raíces', group: 'Servicios' },

  // ==============================================
  // 🚗 AUTO Y MOTO
  // ==============================================
  { id: 'cat_autopartes', name: 'Refacciones y Autopartes', group: 'Vehículos' },
  { id: 'cat_accesorios_auto', name: 'Accesorios para Autos', group: 'Vehículos' },
  { id: 'cat_motos', name: 'Motos y Equipo Biker', group: 'Vehículos' },

  // ==============================================
  // 📦 OTROS
  // ==============================================
  { id: 'cat_sexshop', name: 'Adultos (+18)', group: 'Otros' },
  { id: 'cat_esoterico', name: 'Esotérico y Holístico', group: 'Otros' },
  { id: 'cat_industrial', name: 'Maquinaria e Industrial', group: 'Otros' },
  { id: 'cat_varios', name: 'Otros / Varios', group: 'Otros' },
]
