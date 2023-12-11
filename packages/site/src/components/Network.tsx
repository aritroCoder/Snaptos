import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';

export const Network = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedNetwork, setSelectedNetwork] = useState('testnet');
  
    const handleDropdownClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleDropdownClose = () => {
      setAnchorEl(null);
    };
  
    const handleNetworkSelect = (network) => {
      setSelectedNetwork(network);
      handleDropdownClose();
    };
    return (
        <>
        <div
          style={{
            font: 'Roboto',
            fontSize: '1.6rem',
            border: '1px solid #000',

            borderRadius: '10px',
            width: '10rem',
            height: '3.4rem',
            textAlign: 'center',
            lineHeight: '3rem',
            display: 'inline-block',
          }}
        >
          {selectedNetwork.toUpperCase()}{' '}
          {/* Display the selected network in uppercase */}
          <ArrowDropDownCircleOutlinedIcon
            style={{
              fontSize: 15,
              color: '#434343',
              lineHeight: '3rem',          
              display: 'inline-block'
            }}
            onClick={handleDropdownClick}
          />
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleDropdownClose}
        >
          <MenuItem
            onClick={() => handleNetworkSelect('mainnet')}
            sx={{ fontSize: '15px', font: 'Roboto' }}
          >
            Mainnet
          </MenuItem>
          <MenuItem
            onClick={() => handleNetworkSelect('testnet')}
            sx={{ fontSize: '15px', font: 'Roboto' }}
          >
            Testnet
          </MenuItem>
          <MenuItem
            onClick={() => handleNetworkSelect('devnet')}
            sx={{ fontSize: '15px', font: 'Roboto' }}
          >
            Devnet
          </MenuItem>

        </Menu>{' '}
        <div style={{ marginRight: '20px' }} />
        </>
    )
}