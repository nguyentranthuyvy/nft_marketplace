import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import axios from 'axios'
const{ create } = require ('ipfs-http-client')
const client = create({host: 'ipfs.infura.io', port:5001, protocol:'https'})
const pinataApiKey = '                                                                                  ';
const pinataApiSecret = 'b3457dbbab1d986fbe561b9a7b2bdeefd227af1cb8d85266c1cc3573c1813e0c';

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const uploadToIPFS = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const result = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataApiSecret,
          },
        });

        const ipfsHash = result.data.IpfsHash;
        setImage(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
        console.log(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }
  const createNFT = async () => {
    if (!image || !price || !name || !description) return
    try{
      const fileData = { image, price, name, description };
      console.log(fileData);
      // const formData = new FormData();
      // formData.append('file', new Blob([fileData], { type: 'application/json' }))
      // console.log(formData);

      const result = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', fileData, {
        headers: {
          'pinata_api_key': pinataApiKey,
          'pinata_secret_api_key': pinataApiSecret,
        },
      });
      mintThenList(result.data.IpfsHash)
    } catch(error) {
      console.log("ipfs uri upload error: ", error)
    }
  }
  const mintThenList = async (imageIpfsHash) => {
    const uri = `https://ipfs.io/ipfs/${imageIpfsHash}`;
    console.log(uri);
    await (await nft.mint(uri)).wait();
  
    const id = await nft.tokenCount();
  
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
  
    const listingPrice = ethers.utils.parseEther(price.toString());
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create