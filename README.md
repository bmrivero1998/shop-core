🛒 Shop Core - Manual de Integración

Este repositorio contiene el motor de tienda para la suite UXDriven. Está diseñado para ser inyectado como un submódulo de Git en aplicaciones de React.

1. Requisitos de Infraestructura (Hard Dependencies)

Para que el módulo compile y funcione, el proyecto "Host" DEBE tener instaladas y configuradas las siguientes librerías:

Dependencias de NPM

Ejecuta en la raíz del proyecto principal para instalar las dependencias de UI, utilidades y estado:

npm install lucide-react axios clsx tailwind-merge


Y para los SDKs de las pasarelas de pago (obligatorios para que el módulo de Checkout compile exitosamente):

npm install @stripe/stripe-js @stripe/react-stripe-js @paypal/react-paypal-js @mercadopago/sdk-react


Configuración de Estilos (Tailwind)

El core utiliza utilidades de Tailwind. Asegúrate de que tu archivo tailwind.config.js esté escaneando la ruta del submódulo para que no se pierdan los estilos:

content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  "./src/shop/**/*.{js,ts,jsx,tsx}", // <--- OBLIGATORIO
],


2. Operaciones de Git (Paso a Paso)

Para un proyecto que NO tiene la tienda aún:

# 1. Agregar el repo como submódulo
git submodule add [https://github.com/bmrivero1998/shop-core.git](https://github.com/bmrivero1998/shop-core.git) src/shop

# 2. Registrar el cambio en el proyecto padre
git add .gitmodules src/shop
git commit -m "infra: vincular shop-core"


Para clonar un proyecto que YA tiene el submódulo (ej. Gazel):

Si clonas el proyecto de un cliente y la carpeta src/shop está vacía, corre:

git submodule update --init --recursive


Para actualizar la tienda a la última versión:

Si subiste mejoras al repo shop-core y las quieres en el cliente:

git submodule update --remote --merge


3. Flujo de Desarrollo (Editando el Core)

Si necesitas hacer un cambio en la lógica de la tienda mientras trabajas en un proyecto:

Entrar al submódulo: cd src/shop

Verificar rama: Asegúrate de estar en main o la rama de producción del core.

Hacer el cambio y Push al Core:

git add .
git commit -m "fix: corrección en la lógica de [X]"
git push origin main


Actualizar el puntero en el Proyecto Padre:
Regresa a la raíz del proyecto principal (Gazel, Martin Techs, etc.):

cd ../..
git add src/shop
git commit -m "chore: actualizar referencia de shop-core"
git push origin [tu-rama]


4. Variables de Entorno y Configuración

El archivo src/shop/config.ts es el único que debe ser modificado por instancia.

No subir cambios de config.ts al repositorio shop-core a menos que sea para actualizar la estructura base. Los valores específicos del cliente (como el PROJECT_UUID) deben manejarse con cuidado para no sobreescribir otras tiendas.