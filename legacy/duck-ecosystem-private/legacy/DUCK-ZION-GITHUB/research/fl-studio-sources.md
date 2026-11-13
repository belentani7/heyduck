# Evidencias externas para FL Studio y audio libre

## Compatibilidad oficial de FL Studio

La documentación oficial de Image-Line indica que FL Studio en Windows soporta plugins VST 1/2 de 32 y 64 bits, VST3, CLAP y el formato nativo de Image-Line. En macOS soporta VST 1/2 y VST3 de 64 bits, AU de 64 bits, CLAP y el formato nativo de Image-Line. Los plugins VST/AU/CLAP se cargan mediante Fruity Wrapper y pueden tener diferencias de compatibilidad entre plataformas.

Fuente: [Image-Line — Plugin Standards](https://www.image-line.com/fl-studio-learning/fl-studio-online-manual/html/plugins_supported.htm)

## Catálogo comunitario de audio libre

El repositorio [webprofusion/OpenAudio](https://github.com/webprofusion/OpenAudio) mantiene una lista comunitaria de aplicaciones, plugins y librerías de audio libres. La página clasifica por tipo y framework, e incluye proyectos VST3, CLAP, AU y otros formatos. Entre los ejemplos visibles están Ambience, Aeolus, Airwindows, AnalogChannel, ANATOMY y otros proyectos basados en JUCE o Rust.

El catálogo se usará como fuente de descubrimiento, pero cada plugin será marcado como **verificado**, **pendiente** o **no apto** según licencia, formato, arquitectura, plataforma, firma, procedencia, hash y prueba aislada en un entorno controlado.

## Regla de auditoría

No se instalarán DLL, VST3, CLAP, AU ni ejecutables automáticamente. El paquete contendrá metadatos, enlaces, hashes y adaptadores de catálogo; la instalación requerirá una acción explícita y una comprobación de seguridad previa.
