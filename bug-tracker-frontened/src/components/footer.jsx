const Footer = () => {
    return (
        <footer className="bg-dark text-center position-stikcy bottom-0 text-muted py-3 border-top border-secondary">
            <div className="container">
                <small className="d-block">
                    Bug Tracker © {new Date().getFullYear()}
                </small>
                <small className="d-block mt-1">
                    Built by <a 
                        href="https://www.linkedin.com/in/ashish-sinsinwal-a31b48318/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-decoration-none text-warning"
                    >
                        Ashish Sinsinwal
                    </a>
                </small>
            </div>
        </footer>
    )
}

export default Footer;

