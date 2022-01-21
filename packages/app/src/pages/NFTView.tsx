import {
  Box,
  Heading,
  Text,
  Button,
  Center,
  useColorModeValue,
  Container,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Modal,
  SlideFade,
  Alert,
  AlertIcon,
  Th,
  Tr,
  Tfoot,
  Td,
  Tbody,
  Thead,
  TableCaption,
  Table,
} from "@chakra-ui/react";
import { RouteComponentProps } from "@reach/router";
import React, { useState } from "react";
import { handleErrorMessagesFactory } from "../utils/handleErrorMessages";
import { isMobile } from "react-device-detect";
import { useWeb3React } from "@web3-react/core";
import { useQuery } from "@apollo/client";

import {
  ConnectionStatus,
  ConnectWalletModal,
  getErrorMessage,
} from "../components/ConnectWallet";
import { TxStatusList } from "../components/TxMonitoring";
import { NFT_LEADERBOARD_QUERY } from "../constants/queries";
function NFTView(props: RouteComponentProps) {
  const [localError, setLocalError] = useState("");
  const handleErrorMessages = handleErrorMessagesFactory(setLocalError);
  const headingColor = useColorModeValue(
    "linear(to-l, #50514f, #54885d)",
    "linear(to-l, #e3d606, #54885d, #b1e7a1, #a1beaf, #cd5959)"
  );
  const {
    isOpen: isConnectWalletOpen,
    onOpen: onConnectWalletOpen,
    onClose: onConnectWalletClose,
  } = useDisclosure();
  const displayStatus = (val: boolean) => {
    setIsHidden(val);
  };
  const [isHidden, setIsHidden] = useState(false);
  const leaderBoardRows: JSX.Element[] = [];
  const POLL_INTERVAL = 60000; // 15 second polling interval

  const {
    loading,
    error,
    data: leaderBoardData,
  } = useQuery(NFT_LEADERBOARD_QUERY, {
    variables: {
      numResults: 10,
    },
    pollInterval: POLL_INTERVAL, // Poll every ten seconds
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: ${handleErrorMessages({ err: error })}</p>;
  }
  let count = 0;

  for (const item of leaderBoardData.users) {
    count++;
    const { id, seedCount, seeds } = item;
    const uniqueTypes = [...new Set(seeds.map((s: any) => s.type))];
    leaderBoardRows.push(
      <Tr>
        <Td>{count}</Td>
        <Td>{id}</Td>
        <Td>{seedCount}</Td>
        <Td>{uniqueTypes.toString()}</Td>
      </Tr>
    );
  }

  const {
    active,

    error: web3Error,
  } = useWeb3React();

  return (
    <>
      <Container
        mt={isMobile ? 30 : 50}
        p={5}
        flex="1"
        borderRadius="2xl"
        maxW="container.sm"
      >
        <Center mt={10}>
          {localError && (
            <SlideFade in={true} unmountOnExit={true}>
              <Alert variant={"shrubYellow"} status="info" borderRadius={9}>
                <AlertIcon />
                {localError}
              </Alert>
            </SlideFade>
          )}
        </Center>
        <Center>
          <Box mb={{ base: 6, md: 10 }} mt={6}>
            <Heading
              maxW="60rem"
              fontSize={["5xl", "6xl", "40px", "50px"]}
              fontWeight="medium"
              textAlign="center"
              mb="14"
            >
              <Text
                as="span"
                bgGradient={headingColor}
                bgClip="text"
                boxDecorationBreak="clone"
              >
                Paper Gardener's Leaderboard
              </Text>
            </Heading>
            <Table variant="simple">
              <TableCaption>Paper Gardener's Leaderboard</TableCaption>
              <Thead>
                <Tr>
                  <Th>Rank</Th>
                  <Th>Account</Th>
                  <Th isNumeric>Owns</Th>
                  <Th>SeedType</Th>
                </Tr>
              </Thead>
              <Tbody>{leaderBoardRows}</Tbody>
              <Tfoot>
                <Tr>
                  <Th>Rank</Th>
                  <Th>Account</Th>
                  <Th isNumeric>Owns</Th>
                  <Th>SeedType</Th>
                </Tr>
              </Tfoot>
            </Table>
          </Box>
        </Center>
      </Container>

      <Modal
        isOpen={isConnectWalletOpen}
        onClose={onConnectWalletClose}
        motionPreset="slideInBottom"
        scrollBehavior={isMobile ? "inside" : "outside"}
      >
        <ModalOverlay />
        <ModalContent top="6rem" boxShadow="dark-lg" borderRadius="2xl">
          <ModalHeader>
            {!active ? (
              "Connect Wallet"
            ) : !isHidden ? (
              <Text fontSize={16}>Account Details</Text>
            ) : (
              <Button variant="ghost" onClick={() => displayStatus(false)}>
                Back
              </Button>
            )}{" "}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!active || isHidden ? (
              <ConnectWalletModal />
            ) : (
              !isHidden && <ConnectionStatus displayStatus={displayStatus} />
            )}
            {!(
              web3Error && getErrorMessage(web3Error).title === "Wrong Network"
            ) && <TxStatusList />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default NFTView;
