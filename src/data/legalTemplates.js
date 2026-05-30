/**
 * legalTemplates.js
 *
 * Plantillas legales estándar para agencias inmobiliarias.
 * Estructura: legalTemplates[lang][section]
 *
 * Tokens especiales en cookies:
 *  [GOOGLE_ANALYTICS_PLACEHOLDER] → reemplazado automáticamente si el tenant
 *    tiene analytics_id o google_analytics_id configurado.
 *  [META_PIXEL_PLACEHOLDER]       → reemplazado si el tenant tiene meta_pixel_id.
 */

export const legalTemplates = {
  es: {
    terms: `<h2>Aviso Legal y Términos de Uso</h2>
<p>Bienvenido a nuestra plataforma inmobiliaria. El presente documento regula el uso de los servicios ofrecidos en este portal web. Le rogamos que lea atentamente estas condiciones antes de utilizar la web.</p>

<h3>1. Identificación del Titular</h3>
<p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa que este sitio web es operado por la agencia inmobiliaria cuyos datos de contacto e identidad están reflejados en el pie de página y en la sección de contacto de este portal.</p>

<h3>2. Condiciones de Acceso y Uso</h3>
<p>El acceso al sitio web es gratuito salvo en lo relativo al coste de la conexión a través de la red de telecomunicaciones suministrada por el proveedor de acceso contratado por el usuario. El usuario se compromete a hacer un uso adecuado y lícito del sitio web, de conformidad con la legislación aplicable, las presentes condiciones, la moral y las buenas costumbres generalmente aceptadas.</p>

<h3>3. Propiedad Intelectual e Industrial</h3>
<p>Todos los contenidos del portal (textos, fotografías, gráficos, imágenes, iconos, tecnología, software, links y demás contenidos audiovisuales o sonoros, así como su diseño gráfico y códigos fuente) son propiedad intelectual de la Inmobiliaria o de terceros, sin que puedan entenderse cedidos al usuario ninguno de los derechos de explotación sobre los mismos.</p>

<ul>
  <li>Queda expresamente prohibida la reproducción, copia, distribución o puesta a disposición pública de los contenidos sin autorización.</li>
  <li>Las marcas, nombres comerciales o signos distintivos expuestos son propiedad de la agencia o de sus respectivos titulares.</li>
</ul>

<h3>4. Limitación de Responsabilidad</h3>
<p>La información contenida en esta web (incluyendo precios, superficies y descripciones de las propiedades) es de carácter meramente orientativo y no constituye una oferta contractual. La Inmobiliaria realiza los mayores esfuerzos para mantener la información exacta y actualizada, pero no se responsabiliza de las posibles discrepancias o errores tipográficos.</p>

<h3>5. Legislación Aplicable y Jurisdicción</h3>
<p>Las presentes condiciones se regirán e interpretarán de acuerdo con la legislación española. Para la resolución de cualquier controversia derivada del acceso y uso de este sitio web, el usuario y la Inmobiliaria se someten, con renuncia expresa a cualquier otro fuero que pudiera corresponderles, a los Juzgados y Tribunales del domicilio social de la Inmobiliaria.</p>`,

    privacy: `<h2>Política de Privacidad y Protección de Datos</h2>
<p>Para nosotros, la protección y confidencialidad de sus datos es de máxima importancia. Esta política le informa sobre cómo recopilamos, tratamos y protegemos la información personal que nos facilita, en cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD) y de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>

<h3>1. Responsable del Tratamiento de Datos</h3>
<p>El responsable del tratamiento de los datos recopilados es la agencia inmobiliaria que opera este sitio web. Puede ejercer sus derechos de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición mediante los canales de contacto especificados en este portal.</p>

<h3>2. Finalidad del Tratamiento</h3>
<p>Tratamos sus datos personales con las siguientes finalidades:</p>
<ul>
  <li>Gestionar las solicitudes de información sobre las propiedades publicadas.</li>
  <li>Atender las consultas generales realizadas a través del formulario de contacto.</li>
  <li>Prestar los servicios inmobiliarios contratados de compra, venta o alquiler.</li>
  <li>Remitir comunicaciones comerciales si ha prestado su consentimiento expreso.</li>
</ul>

<h3>3. Legitimación y Conservación</h3>
<p>La base legal para el tratamiento es el consentimiento del interesado al enviar sus consultas y, en su caso, la ejecución de la relación contractual. Los datos se conservarán durante el tiempo necesario para cumplir con la finalidad para la que se recabaron y para determinar las posibles responsabilidades que se pudieran derivar.</p>

<h3>4. Destinatarios y Transferencias Internacionales</h3>
<p>Sus datos no serán cedidos a terceros salvo obligación legal. No se realizan transferencias internacionales de datos fuera del Espacio Económico Europeo, salvo en los casos en que los prestadores de servicios tecnológicos utilizados ofrezcan garantías adecuadas conforme al RGPD.</p>

<h3>5. Derechos del Usuario</h3>
<p>Usted tiene derecho a obtener confirmación sobre si estamos tratando sus datos personales. Puede acceder a sus datos, solicitar la rectificación de datos inexactos o solicitar su supresión cuando los datos ya no sean necesarios para los fines que fueron recogidos. Asimismo, puede retirar el consentimiento prestado en cualquier momento sin que ello afecte a la licitud del tratamiento previo a dicha retirada.</p>

<h3>6. Reclamaciones</h3>
<p>Si considera que el tratamiento de sus datos personales no es adecuado, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD), www.aepd.es.</p>`,

    cookies: `<h2>Política de Cookies</h2>
<p>Este sitio web utiliza cookies y tecnologías similares para mejorar la experiencia de navegación del usuario, obtener datos estadísticos sobre las visitas recibidas y personalizar el contenido mostrado, conforme a lo establecido en la Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE) y el Reglamento (UE) 2016/679 (RGPD).</p>

<h3>1. ¿Qué son las Cookies?</h3>
<p>Las cookies son pequeños archivos de texto que se descargan en su ordenador, smartphone o tableta al acceder a determinadas páginas web. Permiten a una página web almacenar y recuperar información sobre los hábitos de navegación del usuario o de su equipo y, dependiendo de la información que contengan y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario.</p>

<h3>2. Tipos de Cookies Utilizadas</h3>
<p>Este sitio web puede utilizar los siguientes tipos de cookies:</p>
<ul>
  <li><strong>Cookies Técnicas:</strong> Son esenciales para el correcto funcionamiento del portal, permitiendo la navegación y el uso de las diferentes opciones o servicios. Sin estas cookies, el portal no puede funcionar correctamente.</li>
  <li><strong>Cookies de Personalización:</strong> Permiten al usuario acceder al servicio con algunas características predefinidas en función de una serie de criterios, como el idioma de visualización o el tipo de navegador.</li>
  <li><strong>Cookies de Análisis (Estadísticas):</strong> Tratadas por nosotros o por terceros, nos permiten cuantificar el número de usuarios y realizar la medición y análisis estadístico de la utilización que hacen del servicio ofertado. Para ello se analiza su navegación a fin de mejorar la oferta de productos o servicios.</li>
  <li><strong>Cookies de Publicidad Comportamental:</strong> Almacenan información del comportamiento de los usuarios obtenida a través de la observación continuada de sus hábitos de navegación, lo que permite desarrollar un perfil específico para mostrar publicidad en función del mismo.</li>
</ul>

[GOOGLE_ANALYTICS_PLACEHOLDER]

[META_PIXEL_PLACEHOLDER]

<h3>3. Configuración y Desactivación de Cookies</h3>
<p>El usuario puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador. A continuación se indican los enlaces donde puede encontrar información sobre cómo gestionar las cookies en los navegadores más comunes:</p>
<ul>
  <li>Google Chrome: Configuración de cookies</li>
  <li>Mozilla Firefox: Administrar cookies</li>
  <li>Safari: Preferencias de privacidad</li>
  <li>Microsoft Edge: Configuración de privacidad</li>
</ul>
<p>La desactivación de algunas cookies esenciales puede limitar el correcto funcionamiento de algunas secciones de la web. Las cookies de análisis y publicidad comportamental pueden desactivarse sin afectar al funcionamiento básico del portal.</p>

<h3>4. Actualización de la Política de Cookies</h3>
<p>La Inmobiliaria se reserva el derecho de modificar esta Política de Cookies en cualquier momento, sin previo aviso, para adaptarla a novedades legislativas, jurisprudenciales o técnicas. En todo caso, la política vigente será la que se encuentre publicada en esta página.</p>`,
  },

  en: {
    terms: `<h2>Legal Notice and Terms of Use</h2>
<p>Welcome to our real estate platform. This document regulates the use of the services offered on this website. Please read these terms carefully before using the website.</p>

<h3>1. Owner Identification</h3>
<p>In compliance with Article 10 of Law 34/2002 of July 11 on Information Society Services and Electronic Commerce (LSSI-CE), we inform you that this website is operated by the real estate agency whose contact details and identity are reflected in the footer and contact section of this portal.</p>

<h3>2. Conditions of Access and Use</h3>
<p>Access to the website is free of charge except for the cost of the connection through the telecommunications network supplied by the access provider contracted by the user. The user agrees to make appropriate and lawful use of the website in accordance with applicable legislation, these terms, morality, and generally accepted good customs.</p>

<h3>3. Intellectual and Industrial Property</h3>
<p>All contents of the portal (texts, photographs, graphics, images, icons, technology, software, links, and other audiovisual or sound contents, as well as its graphic design and source codes) are the intellectual property of the Real Estate Agency or third parties. None of the exploitation rights over them may be understood to be transferred to the user.</p>

<ul>
  <li>The reproduction, copying, distribution, or public display of the contents without prior authorization is strictly prohibited.</li>
  <li>The trademarks, trade names, or distinctive signs shown are the property of the agency or their respective owners.</li>
</ul>

<h3>4. Limitation of Liability</h3>
<p>The information contained on this website (including prices, sizes, and descriptions of properties) is for guidance purposes only and does not constitute a contractual offer. The Real Estate Agency makes every effort to keep the information accurate and updated but is not responsible for possible discrepancies or typographical errors.</p>

<h3>5. Applicable Law and Jurisdiction</h3>
<p>These terms shall be governed and interpreted in accordance with Spanish law. For the resolution of any dispute arising from access to and use of this website, the user and the Real Estate Agency submit, expressly waiving any other jurisdiction that may apply, to the Courts and Tribunals of the registered office of the Real Estate Agency.</p>`,

    privacy: `<h2>Privacy Policy and Data Protection</h2>
<p>For us, the protection and confidentiality of your data is of maximum importance. This policy informs you about how we collect, process, and protect the personal information you provide to us, in compliance with Regulation (EU) 2016/679 of the European Parliament and of the Council (GDPR) and the applicable national data protection legislation.</p>

<h3>1. Data Controller</h3>
<p>The controller of the collected data is the real estate agency operating this website. You can exercise your rights of access, rectification, erasure, restriction of processing, portability, and objection through the contact channels specified on this portal.</p>

<h3>2. Purpose of Processing</h3>
<p>We process your personal data for the following purposes:</p>
<ul>
  <li>Managing information requests regarding published properties.</li>
  <li>Answering general inquiries made through the contact form.</li>
  <li>Providing the contracted real estate services for buying, selling, or renting.</li>
  <li>Sending commercial communications if you have given your express consent.</li>
</ul>

<h3>3. Legitimization and Conservation</h3>
<p>The legal basis for processing is the consent of the data subject when submitting inquiries and, where applicable, the execution of the contractual relationship. The data will be kept for the time necessary to fulfill the purpose for which it was collected and to determine possible liabilities that may arise.</p>

<h3>4. Recipients and International Transfers</h3>
<p>Your data will not be transferred to third parties unless legally obligated. No international data transfers outside the European Economic Area are carried out, except where the technology service providers used offer adequate guarantees in accordance with the GDPR.</p>

<h3>5. User Rights</h3>
<p>You have the right to obtain confirmation as to whether we are processing your personal data. You can access your data, request the correction of inaccurate data, or request its deletion when the data is no longer necessary for the purposes for which it was collected. Likewise, you can withdraw your consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.</p>

<h3>6. Complaints</h3>
<p>If you consider that the processing of your personal data is not adequate, you have the right to lodge a complaint with the relevant national data protection supervisory authority.</p>`,

    cookies: `<h2>Cookies Policy</h2>
<p>This website uses cookies and similar technologies to improve the user's browsing experience, obtain statistical data about visits received, and personalize displayed content, in accordance with applicable data protection and electronic communications regulations including the GDPR (EU) 2016/679.</p>

<h3>1. What are Cookies?</h3>
<p>Cookies are small text files that are downloaded to your computer, smartphone, or tablet when accessing certain web pages. They allow a website to store and retrieve information about the browsing habits of the user or their device, and depending on the information they contain and how you use your device, they may be used to recognize you as a user.</p>

<h3>2. Types of Cookies Used</h3>
<p>This website may use the following types of cookies:</p>
<ul>
  <li><strong>Technical Cookies:</strong> They are essential for the proper functioning of the portal, allowing navigation and the use of different options or services. Without these cookies, the portal cannot function correctly.</li>
  <li><strong>Personalization Cookies:</strong> They allow the user to access the service with pre-defined characteristics based on a series of criteria, such as display language or browser type.</li>
  <li><strong>Analytical Cookies:</strong> Processed by us or by third parties, they allow us to quantify the number of users and perform statistical measurement and analysis of how the offered service is used. For this purpose, your browsing is analyzed in order to improve our product and service offerings.</li>
  <li><strong>Behavioral Advertising Cookies:</strong> These store information about user behavior obtained through continuous observation of browsing habits, enabling the development of a specific profile to display advertising accordingly.</li>
</ul>

[GOOGLE_ANALYTICS_PLACEHOLDER]

[META_PIXEL_PLACEHOLDER]

<h3>3. Cookie Configuration and Deactivation</h3>
<p>The user can allow, block, or delete cookies installed on their device by configuring the options of their browser. Below are links to information about managing cookies in the most common browsers:</p>
<ul>
  <li>Google Chrome: Cookie settings</li>
  <li>Mozilla Firefox: Manage cookies</li>
  <li>Safari: Privacy preferences</li>
  <li>Microsoft Edge: Privacy settings</li>
</ul>
<p>Disabling some essential cookies may limit the proper functioning of some sections of the website. Analytical and behavioral advertising cookies can be disabled without affecting the basic functionality of the portal.</p>

<h3>4. Updates to the Cookies Policy</h3>
<p>The Real Estate Agency reserves the right to modify this Cookies Policy at any time, without prior notice, to adapt it to legislative, jurisprudential, or technical developments. In any case, the applicable policy will be the one published on this page.</p>`,
  },
}

/**
 * LEGAL_TEMPLATES — backward-compatible alias.
 * Shape: LEGAL_TEMPLATES[section][lang]
 * Used by existing handleLoadTemplate() references.
 */
export const LEGAL_TEMPLATES = {
  terms: {
    es: legalTemplates.es.terms,
    en: legalTemplates.en.terms,
  },
  privacy: {
    es: legalTemplates.es.privacy,
    en: legalTemplates.en.privacy,
  },
  cookies: {
    es: legalTemplates.es.cookies,
    en: legalTemplates.en.cookies,
  },
}
