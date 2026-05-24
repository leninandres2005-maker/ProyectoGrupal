import './Formulario.css'
const PieDePagina = () =>{
    return(
       
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <p className="footer-marca">Jenna Moda</p>
            <p className="footer-desc">Moda para todos. Colecciones exclusivas para hombres, mujeres y niños.</p>
          </div>
          <div className="footer-col">
            <p className="footer-titulo">Categorías</p>
            <ul className="footer-lista">
              <li>Hombres</li>
              <li>Mujeres</li>
              <li>Kids</li>
              <li>Sale</li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-titulo">Ayuda</p>
            <ul className="footer-lista">
              <li>Guía de tallas</li>
              <li>Devoluciones</li>
              <li>Envíos</li>
              <li>Preguntas frecuentes</li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-titulo">Síguenos</p>
            <ul className="footer-lista">
              <li>Instagram</li>
              <li>TikTok</li>
              <li>Facebook</li>
            </ul>
          </div>
        </div>
        <div className="footer-copy">
          <p>© 2026 Si nadie me lee, nadie sabe. Todos los derechos reservados.</p>
        </div>
      </footer>

    )
}
export default PieDePagina;