import { Box, Typography } from '@mui/material';
import React from 'react';
import Image from 'next/image';

type Props = {
  image: string;
  name: string;
  color: string;
};

function ProductEntry({ image, name, color }: Props) {
  return (
    <Box display={'flex'}>
      <Box
        sx={{ border: '1px solid black' }}
        width="135px"
        height={'135px'}
        justifyContent="center"
        alignItems={'center'}
        display="flex"
      >
        <Image src={image} alt="sock" width={81} height={114} />
      </Box>
      <Box
        display={'flex'}
        flexGrow={1}
        flexDirection="column"
        justifyContent={'space-around'}
        marginX={1}
      >
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography>{name}</Typography>
          <Typography variant="h5">$15.00</Typography>
        </Box>
        {/* Second column item */}
        <Box justifyContent="space-between" display={'flex'}>
          <Box>
            <Box display={'flex'}>
              <Typography variant="h5" sx={{ color: '#8296A1' }} mr={1}>
                SIZE
              </Typography>
              <Typography variant="h5">SMALL</Typography>
            </Box>
            <Box display={'flex'}>
              <Typography variant="h5" sx={{ color: '#8296A1' }} mr={1}>
                COLOR
              </Typography>
              <Typography variant="h5">{color}</Typography>
            </Box>
          </Box>
          <Box>
            <Image src="/quantity.svg" alt="counter" height={37} width={115} />
            <Typography variant="h5" sx={{ color: '#ADBCC5' }} textAlign="end">
              REMOVE
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductEntry;
