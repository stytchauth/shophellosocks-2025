import { Box, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ClientHeader from '~components/ClientHeader';
import SiteFooter from '~components/SiteFooter';
import GoogleOneTap from '~components/GoogleOneTap';
import { getAuthUser } from '~lib/auth';

export default async function Home() {
  const authResult = await getAuthUser();

  return (
    <Box
      minHeight={'100vh'}
      display="flex"
      flexDirection={'column'}
      paddingTop={'76px'}
    >
      <ClientHeader useAuthedHeader={!!authResult} />
      <GoogleOneTap delay={2000} />

      <Box
        sx={{
          width: '100%',
          backgroundColor: '#FFD94A',
          minHeight: '650px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflowX: 'hidden',
        }}
      >
        <Box
          sx={{ zIndex: 1 }}
          display="flex"
          alignItems={'center'}
          width="100%"
          maxWidth="1500px"
          justifyContent={'space-around'}
        >
          <Box width={350}>
            <Typography
              sx={{ fontSize: 22, lineHeight: '30px', fontWeight: 500 }}
            >
              JUST DROPPED
            </Typography>
            <Typography
              mt={2}
              sx={{ fontSize: 40, lineHeight: '50px', fontWeight: 600 }}
            >
              The lightest socks you can stomp around in.
            </Typography>
            <Box
              sx={{
                border: '2px solid black',
                backgroundColor: 'white',
                boxShadow: '0px 3px 0px #000',
              }}
              paddingY={1}
              paddingX={2}
              width="fit-content"
              mt={2}
            >
              <Typography
                sx={{ fontSize: 18, lineHeight: '31.5px', fontWeight: 600 }}
              >
                Explore the collection
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{ backgroundColor: 'white', border: '2px solid black' }}
            padding={3}
          >
            <Image src={'/orange.png'} alt="socks" width={515} height={434} />
          </Box>
        </Box>

        {/* Decorative triangles */}
        <Box
          sx={{
            height: 0,
            width: 0,
            border: '5vw solid transparent',
            borderTop: 0,
            borderBottom: '8vw solid #C7F1FF',
            transform: 'rotate(33deg)',
            position: 'absolute',
            left: '5%',
            top: 10,
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: '5vw solid transparent',
            borderTop: 0,
            borderBottom: '12vw solid #C7F1FF',
            transform: 'rotate(33deg)',
            position: 'absolute',
            right: '25%',
            bottom: '5%',
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: '15vw solid transparent',
            borderTop: 0,
            borderBottom: '18vw solid #FD4E43',
            transform: 'rotate(33deg)',
            position: 'absolute',
            right: '-4%',
            top: 10,
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: '3vw solid transparent',
            borderTop: 0,
            borderBottom: '4vw solid #FD4E43',
            transform: 'rotate(65deg)',
            position: 'absolute',
            left: '30%',
            bottom: '10%',
          }}
        />
        <Box
          sx={{
            height: 0,
            width: 0,
            border: '15vw solid transparent',
            borderTop: 0,
            borderBottom: '30vw solid #FD4E43',
            transform: 'rotate(10deg)',
            position: 'absolute',
            left: '-20%',
            bottom: '10%',
          }}
        />
      </Box>

      <Box
        sx={{ backgroundColor: 'white', zIndex: 1 }}
        paddingY={4}
        paddingX={12}
        alignItems="center"
        display={'flex'}
        width="100%"
        flexDirection={'column'}
        flexGrow={1}
      >
        <Box maxWidth={'1500px'} width="100%">
          <Typography variant="h2">Hello Socks IRL</Typography>
          <Typography variant="h4">
            Tag @hellosocks to be featured here!
          </Typography>
          <Stack
            direction={'row'}
            mt={2}
            alignItems="center"
            justifyContent={'space-between'}
            gap={2}
            flexWrap="wrap"
          >
            <Image src={'/tennis.png'} alt="socks" width={275} height={275} />
            <Image src={'/golf.png'} alt="socks" width={275} height={275} />
            <Image src={'/rainbow.png'} alt="socks" width={275} height={275} />
            <Image src={'/camp.png'} alt="socks" width={275} height={275} />
            <ArrowForwardIosIcon sx={{ fontSize: 32 }} />
          </Stack>
        </Box>
      </Box>
      <SiteFooter />
    </Box>
  );
}
