import React from 'react';
import { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, TextField, Modal, Typography, List } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactComponent as Faucet } from '../assets/faucet.svg';

import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  isLocalSnap,
  sendHello,
  sendGetAccount,
  shouldDisplayReconnectButton,
  sendCoin,
  sendFundMe,
  sendTxnHistory,
  sendGetBalance,
  sendSetData,
  sendGetData,
} from '../utils';
import { Card, LoginAccountButton, CreateAccountButton } from '../components';
import SendIcon from '@mui/icons-material/Send';
import { SHA256 } from 'crypto-js';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;


const darkTheme = createTheme({ palette: { mode: 'dark' } });
const lightTheme = createTheme({ palette: { mode: 'light' } });
const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
  ${({ theme }) => theme.mediaQueries.small} {
    font-size: ${({ theme }) => theme.fontSizes.text};
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;
const CreateButton = styled(Button)`
font-size: 1.5rem;
border-radius: 8px;
width: 200px;
height: 40px;
margin-top: 50px; 
align-self: center; 
display: flex;
justify-content: center;
align-items: center;
position: absolute;
top: 10px; 
left: 50%; 
transform: translateX(-50%);
`;
const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background?.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border?.default};
  color: ${({ theme }) => theme.colors.text?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    padding: 1.6rem;
  }
`;
const StyledListContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  height: 400px;
  max-height: 80vh;
  overflow: auto;
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;
const HorizontalButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
`;
const BalanceText = styled.div`
  text-align: center;
  margin-top: 10px;
  font-size: 1.2rem;
`;
const AccountInfoBox = styled.div`
  border: 1px solid rgba(25, 118, 210, 0.5);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  color: black;
  font-size: 1.2rem;  
  width: auto;      
  height: 10px;     
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
  background-color: rgba(25, 118, 210, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  
`;
const AccountModalContent = styled(DialogContent)`
  font-size: 90rem;
  color: #1976d2;
  fontweight: 'bold';
`;

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isAccount, setIsAccount] = useState(false);
  const [showCreateAccountCard, setShowCreateAccountCard] = useState(true);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [pvtKey, setPvtKey] = useState('');

  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? state.isFlask
    : state.snapsDetected;
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState(0);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [isAccountCreating, setIsAccountCreating] = useState(false);
  const [isAccountLogin, setIsAccountLogin] = useState(false);

  const openSendModal = () => {
    setIsSendModalOpen(true);
  };

  const closeSendModal = () => {
    setIsSendModalOpen(false);
  };
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const openConfirmDialog = () => {
    setIsConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputPassword(inputVal);
    setPassword(e.target.value);
    setIsNextButtonDisabled(inputVal === '');
  };
  const handleRecipientChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRecipientAddress(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredAmount = event.target.value;
    setSendAmount(parseFloat(enteredAmount));
    setIsNextButtonDisabled(Number(enteredAmount) > balance);
  };

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };
  const [isActivityListOpen, setIsActivityListOpen] = useState(false);

  const toggleActivityList = () => {
    setIsActivityListOpen(!isActivityListOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const openCreateAccountModal = () => {
    setIsCreatingAccount(true);
  };

  const closeCreateAccountModal = () => {
    setIsCreatingAccount(false);
    setInputPassword('');
  };

  const handleAccountClick = () => {
    openCreateAccountModal();
    setIsAccountCreating(true);
    setIsAccountLogin(false);
  };
  const handleLoginClick = () => {
    openCreateAccountModal();
    setIsAccountLogin(true);
    setIsAccountCreating(false);
  }
  const handleAccount = () => {
    if(isAccountCreating){
      handleSendGetAccount()
    }
    else{
      handleLoginAccount()
    }
    setIsCreatingAccount(false);
    setInputPassword('');
  };

  const handleSend = () => {
    closeSendModal();
    closeConfirmDialog();
    setIsSendModalOpen(true);
  };
  const handleSendGetAccount = async () => {
    try {
      const accountinfo: any = await sendGetAccount();
      const { accountInfo } = accountinfo;
      const {address, bal} = accountInfo;
      setAddress(address);
      setBalance(bal);
      const hashedPassword = SHA256(inputPassword).toString();
      await sendSetData(pvtKey, address, hashedPassword);
      setShowCreateAccountCard(false);
      setIsAccount(true);
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const handleLoginAccount = async () => {
    try {
      const hashedPassword = SHA256(inputPassword).toString();
      const accountinfo: any = await sendGetData(hashedPassword);
      const {address} = accountinfo;
      const bal = await sendGetBalance();
      setAddress(address);
      setBalance(bal);
      setShowCreateAccountCard(false);
      setIsAccount(true);
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  }

  const handleCoinTransfer = async () => {
    closeSendModal();
    try {
      await sendCoin(recipientAddress, sendAmount);
      const updatedBalance = await sendGetBalance();
      setBalance(updatedBalance.balance);
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };
  useEffect(() => {
    if (!isCreatingAccount) {
      setPassword('');
    }
  }, [isCreatingAccount]);
  const handleFundMeWithFaucet = async () => {
    try {
      await sendFundMe();
      const updatedBalance = await sendGetBalance();
      setBalance(updatedBalance.balance);
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const handleGetAllTransactions = async () => {
    try {
      await sendTxnHistory();
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };


  return (
    <Container>
      <Heading>
        Welcome to <Span>Aptos-snap</Span>
      </Heading>
      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
         {showCreateAccountCard && !isAccount && (
        <Card
        content={{
          title: 'Aptos Account Creation',
          description:
            'Create a new Aptos account and start enjoying personalized features.',
          button: (
            <CreateAccountButton
              onClick={handleAccountClick}
              disabled={!state.installedSnap}
            />
          ),
        }}
        disabled={!state.installedSnap}
        fullWidth={
          isMetaMaskReady &&
          Boolean(state.installedSnap) &&
          !shouldDisplayReconnectButton(state.installedSnap)
        }
      />
       )}
       {showCreateAccountCard && !isAccount && (
        <Card
        content={{
          title: 'Aptos Account Login',
          description:
            'Log in to your Aptos account to access your profile.',
          button: (
            <LoginAccountButton
              onClick={handleLoginClick}
              disabled={!state.installedSnap}
            />
          ),
        }}
        disabled={!state.installedSnap}
        fullWidth={
          isMetaMaskReady &&
          Boolean(state.installedSnap) &&
          !shouldDisplayReconnectButton(state.installedSnap)
        }
      />
       )}
      </CardContainer>
      <Dialog open={isSendModalOpen} onClose={closeSendModal}>
        <DialogTitle>Send Funds</DialogTitle>
        <DialogContent>
          <TextField
            label="Recipient Address"
            value={recipientAddress}
            onChange={handleRecipientChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amount"
            type="number"
            value={sendAmount}
            onChange={handleAmountChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSendModal}>Cancel</Button>
          <Button onClick={handleCoinTransfer} disabled ={isNextButtonDisabled} >
            Next
          </Button>
        </DialogActions>
      </Dialog>
      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={closeModal}>
          <DialogTitle>List Item Details</DialogTitle>
          <DialogContent>
            {/* Content for the modal */}
            <p>Details of the selected list item...</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog
        open={isCreatingAccount}
        onClose={closeCreateAccountModal}
        fullWidth
        maxWidth="sm"
        
      >
        <DialogTitle style={{ fontSize: '2rem' }}>Enter Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Password"
            type="password"
            value={inputPassword}
            onChange={handlePasswordChange}
            
            fullWidth
            margin="normal"
            InputLabelProps={{
              style: { fontSize: '1.5rem' },
            }}
            inputProps={{
              style: { fontSize: '1.2rem' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAccount} disabled={isNextButtonDisabled} style={{ fontSize: '1.3rem' }}>
            {isAccountCreating ? 'Create' : 'Login'}
          </Button>
          <Button
            onClick={closeCreateAccountModal}
            style={{ fontSize: '1.3rem' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {isAccount && (
        <>
        <Paper elevation={24} style={{ width: '800px', height: '450px', margin: '20px', padding: '10px', borderRadius: '15px' }}>
      
      
        <AccountInfoBox style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, 29%)' 
        }}>
          <AccountModalContent>
            <Typography variant="body1">
              Account : {address ? address : 'Loading...'}
            </Typography>
          </AccountModalContent>
        </AccountInfoBox>
      
     

      <HorizontalButtonContainer>
        {/* Content inside the custom Container component */}
        <Typography variant="h3" gutterBottom style={{ textAlign: 'center' }}>
          {balance / Math.pow(10, 8)} APT
        </Typography>

        <div style={{ display: 'flex' }}>
          <Button variant="contained" onClick={openSendModal} style={{ backgroundColor: '#6F4CFF', color: 'white', marginRight: '10px' }}>
            <SendIcon />
            SEND
          </Button>
          <Button variant="contained" onClick={handleFundMeWithFaucet} style={{ backgroundColor: '#6F4CFF', color: 'white', marginRight: '10px' }}>
            <Faucet/>
             FAUCET
          </Button>
          <Button variant="contained" onClick={handleGetAllTransactions} style={{ backgroundColor: '#6F4CFF', color: 'white' }}>
            ACTIVITY
          </Button>
        </div>
      </HorizontalButtonContainer>

      <Dialog open={isConfirmDialogOpen} onClose={closeConfirmDialog} fullWidth>
        <DialogTitle>Confirm Transaction</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Recipient Address: {recipientAddress}
          </Typography>
          <Typography variant="body1">Amount: {sendAmount}</Typography>
          <Typography variant="body1">Fee: 0</Typography>

          <Typography variant="body1">
            Total Amount: {(sendAmount) + 0}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Back</Button>
          <Button onClick={handleSend} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {isActivityListOpen && (
        <StyledListContainer>
          <List
            sx={{
              // width: '100%',
              // maxWidth: '90%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              maxHeight: 300,
              '& ul': { padding: 0 },
            }}
            subheader={<li />}
          >
            {[0, 1, 2, 3, 4].map((sectionId) => (
              <li key={`section-${sectionId}`}>
                <ul>
                  {[0, 1, 2].map((item) => (
                    <ListItem button onClick={openModal}>
                      <ListItemText
                        primary={`Item ${item}`}
                        style={{ color: 'black' }}
                      />
                    </ListItem>
                  ))}
                </ul>
              </li>
            ))}
          </List>
        </StyledListContainer>
      )}</Paper></>)}
    </Container>
    
    // </Container>
  );
};

export default Index;
