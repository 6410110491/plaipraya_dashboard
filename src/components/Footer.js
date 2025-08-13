import { CDBBox } from 'cdbreact';

function Footer() {
    return (
        <footer style={{ backgroundColor: '#f8f9fa', width: '100%' }}>
            <CDBBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                flex="wrap"
                className="mx-auto py-4"
                style={{
                    width: '90%',
                    flexWrap: 'wrap',
                    textAlign: 'center',
                    gap: '10px'
                }}
            >
                <CDBBox
                    display="flex"
                    alignItems="center"
                    style={{
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <a
                        href="https://plaiprayahos.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center p-0 text-dark"
                        style={{ flexWrap: 'wrap', justifyContent: 'center' }}
                    >
                        <img
                            alt="logo"
                            src="https://plaiprayahos.com/wp-content/uploads/2019/12/TOP1.png"
                            height={50}
                            style={{ maxWidth: '250px', height: 'auto' }}
                        />
                        <small
                            className="ms-2"
                            style={{
                                fontSize: '0.9rem',
                                display: 'block',
                                width: '100%',
                                textAlign: 'center',
                                marginTop: "0.125rem"
                            }}
                        >
                            &copy; โรงพยาบาลปลายพระยา, 2025. All rights reserved.
                        </small>
                    </a>
                </CDBBox>
            </CDBBox>
        </footer>
    );
}

export default Footer;
