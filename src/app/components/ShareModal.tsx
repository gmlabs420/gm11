"use client"

import React, { useState } from 'react';
import Modal from 'react-modal';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

const ShareModal = ({ isOpen, onRequestClose, url, text }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Share Modal"
      className="share-modal"
      overlayClassName="share-modal-overlay"
    >
      <h2>Share this on</h2>
      <div className="share-buttons">
        <FacebookShareButton url={url} quote={text}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={url} title={text}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <LinkedinShareButton url={url} summary={text}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <WhatsappShareButton url={url} title={text}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    </Modal>
  );
};

export default ShareModal;
