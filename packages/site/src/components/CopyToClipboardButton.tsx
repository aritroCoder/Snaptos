import { useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';

export const CopyToClipboardButton = ({ textToCopy }) => {
  const [isTooltipOpen, setTooltipOpen] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setTooltipOpen(true);

      // Hide tooltip after 2 seconds
      setTimeout(() => {
        setTooltipOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Unable to copy to clipboard', error);
    }
  };

  return (
    <>
      <Tooltip title="Copy to Clipboard" open={isTooltipOpen}>
        <ContentCopyIcon
          style={{ marginLeft: '8px', cursor: 'pointer' }}
          onClick={handleCopyToClipboard}
        />
      </Tooltip>
    </>
  );
};