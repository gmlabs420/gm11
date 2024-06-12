export default function Footer() {
    return (
        <footer className="footer-style">
           <div className="center">
        <div className="toggle-container">
          <h2>GM</h2>
          <input type="checkbox" id="pageToggle" hidden checked />
          <label htmlFor="pageToggle" className="toggle-label"></label>
          <h2>GN</h2>
        </div>
      </div>
            <h1>GM.v1</h1>

            <hr className="footer-line" />
            <div className="footer-links">  
                <a href="https://example.com" target="_blank" className="footer-link page">OTG</a>
                <a href="https://example.com" target="_blank" className="footer-link page">Primordia</a>

                <a href="https://example.com" target="_blank" className="footer-link page">Base</a>
                <a href="https://example.com" target="_blank" className="footer-link page">Thirdweb</a>
            </div>

            <hr className="footer-line" />

            <div className="footer-contract-links">  
                <a href="https://example.com" target="_blank" className="footer-link page">0xD00530a4530471B11f0337C8138ECA5Ef5e2ed48 - Claim</a>
                <a href="https://example.com" target="_blank" className="footer-link page">0xD00530a4530471B11f0337C8138ECA5Ef5e2ed48 - Split</a>

              
            </div>


            
            



            <hr className="footer-line" />


            <div className="footer-text-wrapper">
                <h4>GM and GN NFTs are erc1155 NFT tokens available to support OTG and Primordia. GM and/or GN NFTs are not designed to be financial products
                    or investment contracts. GM and GN NFTs are sold as one time purchases with no on-going or future expectation of reward, profit or utility.
                    No plans exist to bring on going financial value to GM and GN NFTs. Your support is appreciated and will go towards
                    maintaining the GMGN ecosystem. GMGN is designed to be an educational and entertaining product, teaching users how to safely claim and send nfts. 
                </h4>
            </div>





        </footer>
    );
}
