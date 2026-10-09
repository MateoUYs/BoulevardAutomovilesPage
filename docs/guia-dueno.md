# Guia Para Cargar Autos

Esta guia es para el dueño o encargado de Boulevard Automoviles.

## Entrar Al Panel

1. Abrir la web.
2. Ir a `/admin/login`.
3. Ingresar email y contraseña.
4. Entrar al panel.

## Cargar Un Auto Nuevo

1. Ir a `Autos`.
2. Tocar `Nuevo auto`.
3. Completar datos principales:
   - Marca.
   - Modelo exacto.
   - Version.
   - Año.
   - Kilometraje.
   - Precio en USD.
   - Estado: borrador, publicado, reservado o vendido.
4. Cargar imagenes:
   - Minimo 3.
   - Maximo 8.
   - Recomendado 5.
5. Elegir una portada.
6. Ordenar las imagenes con las flechas.
7. Completar ficha tecnica o tocar `Buscar ficha tecnica`.
8. Revisar todos los datos tecnicos.
9. Marcar `Ficha tecnica revisada por el dueño`.
10. Guardar.

## Reglas Importantes

- No publicar si la ficha tecnica no fue revisada.
- Si la fuente dice `AI_ESTIMADO`, revisar con especial cuidado.
- Si no se encuentra el modelo, cargar la ficha manualmente.
- Los consumos son orientativos.
- Los precios siempre se cargan en dolares.

## Estados Del Auto

- `BORRADOR`: no se muestra al publico.
- `PUBLICADO`: aparece en catalogo.
- `RESERVADO`: aparece con badge reservado.
- `VENDIDO`: puede mostrarse u ocultarse segun configuracion.

## WhatsApp

Cada auto genera un mensaje automatico como:

```txt
Hola Boulevard Automoviles, consulto por el Toyota Corolla 2016.
https://sitio.com/autos/toyota-corolla-2016-abc123
```

Si el cliente no tiene WhatsApp abierto, puede tocar `Llamar ahora`.

## Configuracion

En `Configuracion` se puede cambiar:

- Telefonos.
- WhatsApp.
- Instagram.
- Horarios.
- Direccion.
- Mostrar u ocultar vendidos.
- Precio de nafta.
- Precio de gasoil.
- Precio de electricidad.
- Referencias de consumo por categoria.

## Comparador

Los clientes pueden comparar autos desde el catalogo.

El costo estimado cada 100 km usa los precios de combustible cargados en configuracion.

Actualizar esos precios cada tanto para que el dato no quede viejo.
