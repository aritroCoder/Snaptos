/* eslint-disable */
import React from 'react';
import { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactComponent as Faucet } from '../assets/faucet.svg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
import {
  Card,
  LoginAccountButton,
  CreateAccountButton,
  SnapLogo,
} from '../components';
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
  margin-top: 80px;
  font: Roboto;
  font-size: 32px;
  font-weight: 100;
  line-height: 38px;
  letter-spacing: 0em;
  text-align: left;
`;
const BalanceText = styled.div`
  text-align: center;
  margin-top: 10px;
  font-size: 1.2rem;
`;
const AccountInfoBox = styled.div`
  border: none;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 20px;
  color: #001A5D;
  font-size: 1.2rem;
  width: 405px;
  height: 10px;
  
  background-color: #D5E6FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font: Roboto;
font-size: 12px;
font-weight: 300;
line-height: 14px;
letter-spacing: 0em;
text-align: left;
width: 463px
height: 35px
top: 100px
left: 289px
border-radius: 15px


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
  const [open, setOpen] = useState(false);
  const [txnHistory, setTxnHistory] = useState([]);
  const [txncCronJobActive, setTxnCronJobActive] = useState(false);

  const milliToDate = (milli: any) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    let numberString = milli.toString();
    let result = numberString.slice(0, -3);
    let resultNumber = parseFloat(result);
    const date = new Date(resultNumber);
    const time =
      date.getDate() +
      ' ' +
      monthNames[date.getMonth()] +
      ' ' +
      date.getFullYear();
    return time;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }
  const powerToInteger = (number: any) => {
    let formattedAmount = number.toFixed(8); 
    let [integerPart, fractionalPart] = formattedAmount.split('.');
    fractionalPart = fractionalPart.padStart(2, '0');
    let result = `${integerPart}.${fractionalPart}`;
    console.log(result);
    return result;
  }
  
  const toggleOpen = () => {
    setOpen(!open);
  };

  const transactionCronJob = () => {
    const interval = setInterval( async () => {
      const getTxn = await sendTxnHistory();
      setTxnHistory(getTxn.txnHistory);
    }, 5000);
    console.log(interval);
  }

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
  };
  const handleAccount = () => {
    if (isAccountCreating) {
      handleSendGetAccount();
    } else {
      handleLoginAccount();
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
      const accountinfo: any = await sendGetAccount(password);
      const { accountInfo } = accountinfo;
      const { address, bal } = accountInfo;
      setAddress(address);
      setBalance(bal);
      const hashedPassword = SHA256(inputPassword).toString();
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
      const { address } = accountinfo;
      const bal = await sendGetBalance();
      setAddress(address);
      setBalance(bal);
      setShowCreateAccountCard(false);
      setIsAccount(true);
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const handleCoinTransfer = async () => {
    closeSendModal();
    try {
      await sendCoin(recipientAddress, sendAmount);
      const updatedBalance = await sendGetBalance();
      setBalance(updatedBalance);
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
      setBalance(updatedBalance);
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  const handleGetAllTransactions = async () => {
    try {
      const getTxn = await sendTxnHistory();
      setTxnHistory(getTxn.txnHistory);
      toggleOpen();
      if (!txncCronJobActive) {
        transactionCronJob();
        setTxnCronJobActive(true);
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: MetamaskActions.SetError, payload: error });
    }
  };

  /*DROP-DOWN LOGIC*/

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
    handleDropdownClose();
    // Add logic here to handle the selected network (e.g., switch network configuration)
  };
  return (
    <Container>
      <Heading>
        Welcome to <Span>SNAPTOS</Span>
      </Heading>
      <Typography variant="h5" gutterBottom style={{font:'Roboto',fontSize:'18px'}}>
        Integrate Aptos Blockchain with metamask
      </Typography>
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
          <Button onClick={handleCoinTransfer} disabled={isNextButtonDisabled}>
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
          <Button
            onClick={handleAccount}
            disabled={isNextButtonDisabled}
            style={{ fontSize: '1.3rem' }}
          >
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
          <Paper
            elevation={8}
            style={{
              width: '1000px',
              height: '720px',
              margin: '20px',
              padding: '20px',
              borderRadius: '15px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {' '}
            
            <ArrowDropDownCircleOutlinedIcon
              style={{
                position: 'absolute',
                top: '15px',
                left: '20px',
                fontSize: 32,
                color: '#ccc',
              }}
              onClick={handleDropdownClick}
            />
            <div
              style={{
                font: 'Roboto',
                marginLeft: '-650px',
                fontSize: '14px',
                border: '1px solid #000',
                padding: '3px 6px',
                borderRadius: '15px',
              }}
            >
              {selectedNetwork.toUpperCase()}{' '}
              {/* Display the selected network in uppercase */}
            </div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleDropdownClose}
            >
              <MenuItem
                onClick={() => handleNetworkSelect('mainnet')}
                sx={{ fontSize: '20px', font: 'Roboto' }}
              >
                Mainnet
              </MenuItem>
              <MenuItem
                onClick={() => handleNetworkSelect('testnet')}
                sx={{ fontSize: '20px', font: 'Roboto' }}
              >
                Testnet
              </MenuItem>
              <MenuItem
                onClick={() => handleNetworkSelect('devnet')}
                sx={{ fontSize: '20px', font: 'Roboto' }}
              >
                Devnet
              </MenuItem>
            </Menu>
            <OpenInNewIcon
              style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                width: '25px',
                height: '25px',
                color: '#ccc',
              }}
              onClick={() => {
                window.open(
                  'https://explorer.aptoslabs.com/account/',
                  '_blank',
                );
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                position: 'relative',
              }}
            >
              <AccountCircleIcon
                style={{
                  width: '25px',
                  height: '25px',
                  marginRight: '-33px',
                  color: '#434343',
                  marginTop: '-32px',
                }}
              />

              <Typography
                variant="h4"
                gutterBottom
                style={{
                  font: 'Roboto',
                  fontSize: '24px',
                  fontWeight: 530,
                  marginLeft: '40px',
                  color: '#000000',
                  marginTop: '-25px'
                }}
              >
                Aptos Account
              </Typography>
            </div>{' '}
            <hr
              style={{
                width: '100% ',
                margin: '0 auto',
                borderBottom: '0.2px solid #ccc',
                boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.2)',
                marginTop: '-15px',
              }}
            />
            <AccountInfoBox
              style={{
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translate(-50%, 50%)',
              }}
            >
              <AccountModalContent>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1">
                    {address ? address : 'Loading...'}
                  </Typography>
                  <ContentCopyIcon
                    style={{ marginLeft: '8px', cursor: 'pointer' }}
                    onClick={() => {}}
                  />
                </div>
              </AccountModalContent>
            </AccountInfoBox>
            <HorizontalButtonContainer>
              <Typography
                variant="h3"
                gutterBottom
                style={{ textAlign: 'center' }}
              >
                {balance / Math.pow(10, 8)} APT
              </Typography>

              <div style={{ display: 'flex', paddingBottom: '50px' }}>
                <Button
                  variant="contained"
                  onClick={openSendModal}
                  style={{
                    width: '94px',
                    height: '32px',
                    position: 'absolute',
                    top: '205px',
                    left: '240px',
                    borderRadius: '10px',
                    background: '#2F81FC',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    fontSize: '12px',
                    font: 'Roboto',
                  }}
                >
                  <SendIcon style={{ marginRight: '5px' }} />
                  SEND
                </Button>
                <Button
                  variant="contained"
                  onClick={handleFundMeWithFaucet}
                  style={{
                    width: '105px',
                    height: '32px',
                    position: 'absolute',
                    top: '205px',
                    left: '351px',
                    borderRadius: '10px',
                    font: 'Roboto',
                    fontSize: '12px',
                    fontWeight: '400',
                    lineHeight: '18px',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    background: '#2F81FC',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                  }}
                >
                  <Faucet style={{ fill: 'white', marginRight: '5px' }} />
                  FAUCET
                </Button>
                <Button
                  variant="contained"
                  onClick={handleGetAllTransactions}
                  style={{
                    width: '147px',
                    height: '32px',
                    position: 'absolute',
                    top: '205px',
                    left: '472px',
                    borderRadius: '10px',
                    font: 'Roboto',
                    fontSize: '12px',
                    fontWeight: '400',
                    lineHeight: '18px',
                    letterSpacing: '0em',
                    textAlign: 'left',
                    background: '#2F81FC',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                  }}
                >
                  {' '}
                  <ReceiptIcon style={{ marginRight: '5px' }} />
                  Transactions
                </Button>
              </div>
              {!open && <p>Click on transaction history to view all transactions.</p>}
                {open && txnHistory.length > 0 && (
                    
                  <div style={{ overflowX: 'auto', overflowY: 'scroll', maxHeight: '480px' }}>
                    <TableContainer component={Paper}>
                      <Table style={{fontSize: '30px'}}>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ fontSize: '15px' }}>Version</TableCell>
                            <TableCell style={{ fontSize: '15px' }}>Hash</TableCell>
                            <TableCell style={{ fontSize: '15px' }}>Value (APT)</TableCell>
                            <TableCell style={{ fontSize: '15px' }}>Timestamp</TableCell>
                            <TableCell style={{ fontSize: '15px' }}>View on Explorer</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {txnHistory.map((txn, i) => (
                            <TableRow key={i}>
                              <TableCell style={{ fontSize: '14px' }}>{txn.version}</TableCell>
                              <TableCell style={{ fontSize: '14px' }}>{txn.hash}</TableCell>
                              <TableCell style={{ fontSize: '14px' }}>{powerToInteger(txn.events[0].data.amount*Math.pow(10,-8))}</TableCell>
                              <TableCell style={{ fontSize: '14px' }}>{milliToDate(txn.timestamp)}</TableCell>
                              <TableCell>
                                <a href={`https://explorer.aptoslabs.com/txn/${txn.hash}?network=devnet`} target='_blank'>
                                  <SnapLogo color='black' size={36} />
                                </a>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
                {open && txnHistory.length === 0 && <p>No transactions to display.</p>}
            </HorizontalButtonContainer>
            <Dialog
              open={isConfirmDialogOpen}
              onClose={closeConfirmDialog}
              fullWidth
            >
              <DialogTitle>Confirm Transaction</DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  Recipient Address: {recipientAddress}
                </Typography>
                <Typography variant="body1">Amount: {sendAmount}</Typography>
                <Typography variant="body1">Fee: 0</Typography>

                <Typography variant="body1">
                  Total Amount: {sendAmount + 0}
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
            )}
          </Paper>
        </>
      )}
    </Container>

    // </Container>
  );
};

export default Index;
