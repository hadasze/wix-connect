export const templateHTML = (title, emailContent, firstLastName, positionTitle, emailContent2) => {
    return `<!DOCTYPE html>
<html>

<head><meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
  <meta name="format-detection" content="telephone=no">
  <!-- rpcampaign:blogbackupEN2017-->
  <title>Wix.com </title>
  <style type="text/css">
    body {
      -webkit-text-size-adjust: none;
      -ms-text-size-adjust: none;
      font-family: Helvetica, arial, sans-serif;
    }

    body {
      margin: 0;
      padding: 0;
    }

    table {
      border-spacing: 0;
    }

    table td {
      border-collapse: collapse;
    }

    a {
      text-decoration: none;
    }

    div.desktop-header {
      color: #ffffff;
    }
    table.container {
      width: 600px !important;
    }
   .center-block{
      text-align: center !important;
    }
    .padding-zero-cta {
        padding: 30px 0px 0px 0px !important;
      }
      .mobile-text-block-center {
        text-align: center !important;
     }
     .underline-block{
        text-decoration: underline !important;
      }
    
    /* Desktops and laptops ----------- */

    @media only screen and (max-width:1290px) {
      .container-padding-3 {
        -webkit-border-radius: 0 !important;
        padding-left: 4% !important;
        padding-right: 4% !important;
      }
      .container-padding-cta{
         -webkit-border-radius: 0 !important;
        padding-left: 28% !important;
        padding-right: 28% !important;
        }
      .text-block-sub-titel {
        font-size: 100% !important;
        line-height: 150% !important;
      }
      .mobile-text-block-center {
        text-align: center !important;
      }
      .facebook-icon{
       width: 50% !important;
      }
      .text-block-1 {
        font-size: 16px !important;
      }
      .padding-zero-cta {
        padding: 30px 0px 0px 0px !important;
      }
      .underline-block{
        text-decoration: underline !important;
      }
      .display{
        display: none !important;
      }
      .underline-block{
        text-decoration: underline !important;
      }
  
    }
  
    @media only screen and (min-width:620px) and (max-width:800px) {
    .ipad-width{
        width: 630px !important;
     }
     .center-block{
      text-align: center !important;
    }
    .underline-block{
        text-decoration: underline !important;
      }
    }
    
    @media only screen and (max-width:600px) {
      .mobile-padding{
            padding: 18px 5px !important;
        }
        .one-cta{
          display:none !important;
        } 
        .align-mobile{
            text-align:left !important;
        }
        .mobile-font{
          font-size: 17px !important;
          line-height: 20px !important;
          color:#000000 !important;
        }
        .small-text-padding{
          padding-left: 22px !important;
        }
        .mob-padding-left-zero
      {
        padding-left: 0!important;
      }
      .mob-break {
      display: block!important;
      }
      .no-desk {
      display: block!important;
      }
      .center-block{
      text-align: center !important;
    }
      .mob-margin-bottom-0 {
        margin-bottom:0px !important;
        margin-bottom: none !important;
      }
      .mobile-double-cta-width {
        display: block !important;
        line-height: 2.2em !important;
      }
      .mobile-double-block-full-width {
        display: block !important;
        width: 100%!important;
      }
      .desktop-only{
        display: none!important;
      }
      .logo-width {
        width: 50%!important;
      }
      .underline-block{
        text-decoration: underline !important;
      }
      .mobile-double-cta-width {
        width: 100%!important;
        max-width: 100%!important;
      }
      .mobile-float-left {
        float: left!important;
      }
    
      .mobile-border-none{
        border-right: none!important;
      }
      .mobile-text-block-center {
        text-align: center !important;
      }
      .mobile-font-size{
        font-size: 16px !important;
      }
      .text-block {
        display: block;
        font-size: 90% !important;
        line-height: 150% !important;
      }
      .text-block-titel {
        font-size: 85% !important;
        line-height: 120% !important;
      }
      .text-block-sub-titel {
        font-size: 90% !important;
        line-height: 150% !important;
      }
      .text-block-bold-header {
        font-size: 18px !important;
      }
      .text-block-cta-mobile {
        font-size: 16px !important;
      }
      .padding-zero {
        padding: 0 0 0 0 !important;
      }
      .padding-zero-cta {
        padding: 0px 0px 0px 0px !important;
      }
      .mob-padding-top-0 {
        padding-top: 0px !important;
      }
      .mob-padding-bottom-0 {
        padding-top: 0px !important;
      }
      .mob-padding-top-2 {
        padding-top: 2px !important;
      }
      .mob-padding-left-0 {
        padding-left: 0px !important;
      }
      .mob-padding-left-15 {
            padding-left: 14px !important; 
        }
      .mob-padding-right-10 {
        padding-right: 10px !important;
      }
      .mob-padding-top-2 {
        padding-top: 2px !important;
      }
      .mob-padding-top-10 {
        padding-top: 10px !important;
      }
      .mob-padding-top-15 {
        padding-top: 15px !important;
      }
      .mob-padding-top-18 {
        padding-top: 18px !important;
      }
      .mob-padding-top-20 {
        padding-top: 20px !important;
      }
      .mob-padding-top-25 {
        padding-top: 25px !important;
      }
      .mob-padding-top-30 {
        padding-top: 30px !important;
      }
      .mob-padding-top-35 {
        padding-top: 35px !important;
      }
      .mob-padding-top-40 {
        padding-top: 40px !important;
      }
      .mob-padding-top-45 {
        padding-top: 45px !important;
      }
      .mob-padding-top-50 {
        padding-top: 50px !important;
      }
      .mob-padding-top-60 {
        padding-top: 60px !important;
      }
      .mob-padding-top-70 {
        padding-top: 70px !important;
      }
      .mob-padding-bottom-0 {
        padding-bottom: 0px !important;
      }
      .mob-padding-bottom-2 {
        padding-bottom: 2px !important;
      }
      .mob-padding-bottom-5 {
        padding-bottom: 5px !important;
      }
      .mob-padding-bottom-10 {
        padding-bottom: 10px !important;
      }
      .mob-padding-bottom-15 {
        padding-bottom: 15px !important;
      }
      .mob-padding-bottom-18 {
        padding-bottom: 18px !important;
      }
      .mob-padding-bottom-20 {
        padding-bottom: 20px !important;
      }
      .mob-padding-bottom-25 {
        padding-bottom: 25px !important;
      }
      .mob-padding-bottom-30 {
        padding-bottom: 30px !important;
      }
      .mob-padding-bottom-35 {
        padding-bottom: 35px !important;
      }
      .mob-padding-bottom-40 {
        padding-bottom: 40px !important;
      }
      .mob-padding-bottom-45 {
        padding-bottom: 45px !important;
      }
      .mob-padding-bottom-50 {
        padding-bottom: 50px !important;
      }
      .mob-padding-bottom-60 {
        padding-bottom: 60px !important;
      }
      .mob-padding-bottom-70 {
        padding-bottom: 70px !important;
      }
      .mob-img-full-width {
        width: 100% !important;
        max-width: 100% !important;
      }
      .no-border-mob {
        border: none!important;
      }
      div,
      span {
        text-size-adjust: none;
      }
      .container-padding-3 {
        -webkit-border-radius: 0 !important;
        padding-left: 0 !important;
        padding-right: 0% !important;
      }
      .container-padding {
        -webkit-border-radius: 0 !important;
        padding-left: 3% !important;
        padding-right: 3% !important;
      }
      .container-padding-2 {
        -webkit-border-radius: 0 !important;
        padding-left: 3% !important;
        padding-right: 3% !important;
      }
      .container-padding-logo {
        -webkit-border-radius: 0 !important;
        padding-left: 2% !important;
        padding-right: 3% !important;
      }
      div {
        -webkit-text-size-adjust: none;
      }
      table.container {
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .desktop-block {
        display: none !important;
      }
      .mobile-block-holder {
        width: 100% !important;
        height: auto !important;
        max-width: none !important;
        max-height: none !important;
        display: block !important;
      }
      .mobile-block {
        display: block !important;
      }
      .mobile-disclaimer {
        background-color: #ffffff;
      }
      .text-block-2 {
        font-size: 90% !important;
        line-height: 130% !important;
      }
      .mobile-bullet-padding {
        vertical-align: top !important;
      }
      .border{
            border-collapse: collapse !important;
        }
    }
    /*Iphonw 12 Pro Max */
   @media screen and (max-device-width: 480px) and (min-device-width: 406px) {
      u+.body .full-wrap {
        width: 100% !important;
        width: 100vw !important;
      }
      .text-block-titel{
        font-size: 85% !important;
        line-height: 120% !important;
      }
    }




  </style>

<style type="text/css"> 
    @media only screen and (max-width:492px) {
      .text-block-titel {
        font-size: 70% !important;
        line-height: 120% !important;
      }
      .text-block-sub-title {
        font-size: 95% !important;
        line-height: 130% !important;
      }
      .text-block-date {
        font-size: 95% !important;
        line-height: 130% !important;
      }
    }
    @media only screen and (max-width:438px) {
      .text-block-titel {
        font-size: 67% !important;
        line-height: 120% !important;
      }
      .text-block-sub-titel {
        font-size: 90% !important;
        line-height: 130% !important;
      }
      .text-block {
        display: block;
        font-size: 90% !important;
        line-height: 150% !important;
      }
      .text-block-sub-title {
        font-size: 95% !important;
        line-height: 130% !important;
      }
      .text-block-date {
        font-size: 95% !important;
        line-height: 130% !important;
      }
    } 
    /*Iphone 12 Pro - GMAIL*/ 
    @media only screen and (min-width:377px) and (max-width:399px) {
      .text-block-titel {
        font-size: 60% !important;
        line-height: 100% !important;
      }
      .text-block-sub-title {
        font-size: 90% !important;
        line-height: 130% !important;
      }
      .text-block-date {
        font-size: 70% !important;
        line-height: 100% !important;
      }
    }
    /*SAMSUNG EDGE GMAIL and NATIVE*/
    @media screen and (min-width:400px) and (max-width: 420px) {
      .text-block-titel {
        font-size: 55% !important;
        line-height: 90% !important;
      }
      .text-block-sub-title {
        font-size: 95% !important;
        line-height: 130% !important;
      }
      .text-block-date {
        font-size: 60% !important;
        line-height: 100% !important;
      }
    }

</style>

<style type="text/css">
    /*iPHONE WHITE HUGE GMAIL*/
    
    @media screen and (min-width:414px) and (max-width: 420px) {
      .text-block-sub-title {
        font-size: 95% !important;
        line-height: 130% !important;
      }
      .text-block-date {
        font-size: 95% !important;
        line-height: 130% !important;
      }
      .text-block-titel {
        font-size: 85% !important;
        line-height: 120% !important;
      }
    }
    /* all Sumsungs Gmail App*/
    
    @media only screen and (min-device-width:358px) and (max-device-width:363px) {
      .text-block-sub-title {
        font-size: 90% !important;
        line-height: 130% !important;
      }
      .text-block-date {
        font-size: 90% !important;
        line-height: 130% !important;
      }
      .text-block-titel {
        font-size: 55% !important;
        line-height: 120% !important;
      }
      .text-block {
        display: block;
        font-size: 90% !important;
        line-height: 150% !important;
      }
      .text-block-sub-titel {
        font-size: 90% !important;
        line-height: 150% !important;
      }
    }
    /*Samsung green/turkiz Native*/
    
    @media screen and (min-device-width: 320px) and (max-device-width: 640px) and (-webkit-device-pixel-ratio: 4) {
      .text-block-sub-title {
        font-size: 120% !important;
        line-height: 130% !important;
      }
      .text-block-date {
        font-size: 120% !important;
        line-height: 130% !important;
      }
      .text-block-titel {
        font-size: 3rem !important;
        line-height: 36px !important;
      }
      .text-block {
        display: block;
        font-size: 90% !important;
      }
    }
</style>
  <style type="text/css">


    /*Samsung 7 black Native*/
    
    @media screen and (min-device-width: 192px) and (max-device-height: 640px) and (-webkit-device-pixel-ratio: 3) {
      .text-block-sub-title {
        font-size: 120% !important;
        line-height: 130% !important;
      }
      .text-block-date {
        font-size: 120% !important;
        line-height: 130% !important;
      }
      .text-block-titel {
        font-size: 80% !important;
        line-height: 120% !important;
      }
      .text-block {
        display: block;
        font-size: 90% !important;
        line-height: 150% !important;
      }
      .text-block-2 {
        font-size: 12px!important;
        line-height: 16px !important;
      }
    }
    /*Iphone 5+4  Native + Gmail App*/
    
    @media only screen and (min-width:320px) and (max-width:320px) {
      .text-block-sub-title {
        font-size: 1em !important;
        line-height: 1em !important;
      }
      .text-block-date {
        font-size: 1em !important;
        line-height: 1em !important;
      }
      .text-block-titel {
        font-size: 70% !important;
        line-height: 120%!important;
      }
      .text-block-sub-titel {
        font-size: 0.7em !important;
        line-height: 150%!important;
      }
      .text-block {
        display: block;
        font-size: 90% !important;
        line-height: 150% !important;
      }
      u+.body .full-wrap {
        width: 100% !important;
        width: 100vw !important;
      }
    }
    /*Iphone 6,7 and iPhone Xs Big Gmail App, Gmail- IOS 14*/
    
    @media only screen and (min-device-width:375px) and (max-width:376px) {
      .text-block-sub-title {
        font-size: 95% !important;
        line-height: 130% !important;
      }
      .text-block-date {
        font-size: 95% !important;
        line-height: 130% !important;
      }
      .text-block-titel {
        font-size: 60% !important;
        line-height: 120% !important;
      }
      .text-block-sub-titel {
        font-size: 90% !important;
        line-height: 130% !important;
      }
      u+.body .full-wrap {
        width: 100% !important;
        width: 100vw !important;
      }
    }


</style>
<style type="text/css">
      /*Iphone White Huge and iPhone Xs Native*/
    
      @media only screen and (min-device-width:375px) and (max-device-width:521px) and (-webkit-min-device-pixel-ratio:3) {
      .text-block-sub-title {
        font-size: 90% !important;
        line-height: 130% !important;
      }
      .text-block-date {
        font-size: 90% !important;
        line-height: 130% !important;
      }
      .text-block-titel {
        font-size: 70% !important;
        line-height: 120% !important;
      }
    }
    
    .mobile-block-holder {
      width: 0;
      height: 0;
      max-width: 0;
      max-height: 0;
      overflow: hidden;
    }
    
    .mobile-block-holder,
    .mobile-block {
      display: none;
    }
    
    .desktop-block,
    .desktop-header,
    .desktop-image {
      display: block;
    }
</style>
  
  

  
    </head>

<body class="body" yahoo="fix" style="background-color: #fff; margin: 0; min-width: 100%; height: 100%;margin: 0; padding: 0; width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%">
<div>
<center><!--[if gte mso 9]>
    <table align='center' border='0' cellspacing='0' cellpadding='0' width='800'>
      <tr>
        <td align='center' valign='top'>
    <![endif]-->
<table class="full-wrap" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="background-color: #fff; min-width: 320px; direction: ltr;border-collapse: collapse; mso-table-lspace: 0pt; margin: 0 auto; mso-table-rspace: 0pt;-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; height: 100%; margin: 0;padding: 0; width: 100%">
<tr>
<td align="center" height="100%" valign="top" width="100%" style="mso-line-height-rule: exactly;-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #fff">
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
    <td align="left" valign="top" style="padding-right:10px;padding-top:5px;padding-bottom:5px;font-family:Helvetica, Arial, sans-serif;font-size:11px;line-height:14px;color:#666666; display:none !important;max-height:0px;overflow:hidden;">
<span id="preheader" style=" display: none; height: 0; line-height: 0;max-height: 0; max-width: 0; opacity: 0; overflow: hidden; visibility: hidden;width: 0">
<div style="display: none; max-height: 0px; overflow: hidden;">
${"preheader"}
</div>
<div style="display: none; max-height: 0px; overflow: hidden;">
                            &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
                        </div>
</span></td>
</tr>
</table><!--[if gte mso 9]>
          <table align='center' border='0' cellspacing='0' cellpadding='0' width='800'>
            <tr>
              <td align='center' valign='top'>
          <![endif]-->
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 800px;margin: 0 auto; background-color: #fff; border-collapse: collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%"><!--Here Is the cant see this email-->
<tbody>
<tr>
<td class="desktop-block" align="left" valign="top" style=" padding-top: 10px; padding-bottom: 10px;mso-line-height-rule: exactly; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%">
<table style="min-width: 100%; border-collapse: collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%" border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
<tr>
<td align="center" colspan="2" style="text-align: center" class="desktop-block">
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td align="center" valign="top" width="100%" style="padding-left: 0px; margin-left: 0px; background-color: #ffffff;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 800px;background-color: #ffffff; border-collapse: collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%">
<tbody>
<tr>
<td class="padding-zero container-padding " align="left" valign="top" style="padding-top: 15px;padding-bottom:10px;background-color: #ffffff;"><!--[if gte mso 9]>
                          <table align='center' border='0' cellspacing='0' cellpadding='0' width='800'>
                            <tr>
                              <td align='center' valign='top'>
                          <![endif]-->
<table style="min-width: 100%; border-collapse: collapse; mso-table-lspace: 0pt;background-color: #ffffff; max-width: 720px; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%" border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
<tr>

</tr>
</tbody>
</table><!--[if gte mso 9>
                              </td>
                              </tr>
                              </table>
                              <![endif]-->
</td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td align="center" valign="top" class="no-border-mob" style="padding-top: 0; padding-bottom: 0; mso-line-height-rule: exactly;-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #ffffff;">
<table align="center" class="no-border-mob" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; ">
<tbody>
<tr>
<td align="center" valign="top" style="padding-right: 0px; padding-bottom: 0px; background-color: #ffffff;padding-left: 0px; mso-line-height-rule: exactly; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
<table style="border-collapse: collapse; mso-table-lspace: 0pt; max-width: 800px;background-color: #ffffff; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%" border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
<tr>
<td class="mobile-disclaimer" align="center" valign="top" style="">
<div style="display: inline-block; max-width: 100%; vertical-align: top; width: 100%; "><!--[if (gte mso 9)|(IE)]>
                            <table align='center' border='0' cellspacing='0' cellpadding='0' width='800'>
                              <tr>
                                <td align='center' valign='top' width='800'> <![endif]-->
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 800px; ">
<tbody>
<tr>
<td class="container-padding-3 container-padding mob-padding-top-20" align="center" valign="top" width="100%" style="padding-top: 40px; padding-bottom: 30px; margin: 0px; background-color: #ffffff;"><!--[if gte mso 9]>
                                      <table align='center' border='0' cellspacing='0' cellpadding='0' width='720'>
                                        <tr>
                                          <td align='center' valign='top'>
                                      <![endif]-->
<table class="border" bgcolor="#ffffff" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:0; max-width: 600px;border-radius:5px 5px 0px 0px; mso-table-lspace: 0pt; mso-table-rspace: 0pt;-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; ">
<tbody>
<tr>
<td align="center" valign="top"><!--[if gte mso 9]>
                                          <table align='center' border='0' cellspacing='0' cellpadding='0' width='600'>
                                            <tr>
                                              <td align='center' valign='top'> <![endif]-->
<table style="min-width: 100%; border-collapse: collapse; mso-table-lspace: 0pt;max-width: 600px; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%" border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
<tr>
<td class="mob-padding-bottom-15" align="" width="600" style="color: #000000;padding-top: 5px; padding-bottom:15px;text-size-adjust: 100%; font-family: Arial, Helvetica, sans-serif;font-size: 20px; font-style: normal; font-weight: normal; line-height: 30px;" valign="top">
<span style="color: #000000;padding-bottom: 0px; font-weight: normal; " class="text-block-sub-title">
<span class="" style=""><strong>${title}</strong></span><br>

</span>
</td>
</tr>
<tr>
<td class="mob-padding-bottom-10" align="" width="600" style="color: #000000;padding-top: 5px;text-size-adjust: 100%; font-family: Arial, Helvetica, sans-serif;font-size: 16px; font-style: normal; font-weight: normal; line-height: 30px;" valign="top">
<span style="color: #000000;padding-bottom: 0px; font-weight: normal; " class="">
<span class="" style="">${emailContent}</span><br>

</span>
</td>
</tr>
    
    
</tbody>
</table><!--[if gte mso 9>
                                                </td>
                                                </tr>
                                                </table><![endif]-->
</td>
</tr>
</tbody>
</table><!--[if gte mso 9>
                                          </td>
                                          </tr>
                                          </table>
                                          <![endif]-->
</td>
</tr>
<tr>
<td class="container-padding container-padding-3" align="center" valign="top" width="100%" style="padding: 0px; margin: 0px; background-color: #ffffff;">
</td>
</tr>
<tr>
<td class="mobile-disclaimer no-border-mob" align="center" valign="top" style="">
<div style="display: inline-block; max-width: 100%; vertical-align: top; width: 100%;"><!--[if (gte mso 9)|(IE)]>
                                   <table align='center' border='0' cellspacing='0' cellpadding='0' width='800'>
                                     <tr> 
                                       <td align='center' valign='top' width='800'"> <![endif]-->
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 800px;">
<tbody><!--[if !mso]>
                                <!-- -->
<tr>
<td>
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td>
</td>
</tr>
</table>
</td>
</tr><!--<![endif]-->
<tr>
<td class="ipad-width" align="center" valign="top" style="padding-top: 0; mso-line-height-rule: exactly;-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #ffffff;">
<table class="ipad-width" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; background-color: #ffffff;">
<tr>
<td class="ipad-width" align="center" valign="top" style="padding-right: 0px; padding-left: 0px; mso-line-height-rule: exactly; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; background-color: #ffffff;"><!--[if (gte mso 9)|(IE)]>
                                            <table align='center' border='0' cellspacing='0' cellpadding='0' width='720'>
                                              <tr>
                                                <td align='center' valign='top' width='720'"> <![endif]-->
<table style="border-collapse: collapse; mso-table-lspace: 0pt; max-width: 720px; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #ffffff;" border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td class="ipad-width" align="center" valign="top" style="padding-bottom: 20px;">
<div style=" display: inline-block; max-width: 100%; vertical-align: top; width: 100%;"><!--[if (gte mso 9)|(IE)]>
                                            <table align='center' border='0' cellspacing='0' cellpadding='0' width='720'>
                                              <tr>
                                                <td align='center' valign='top' width='720'"> <![endif]-->
<table class="ipad-width" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 720px;">
<tr>
<td class="ipad-width" align="center" valign="top" width="100%" style="background-color: #ffffff; margin: 0px;">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px;border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
<tr>
<td class="container-padding container-padding-3" align="center" valign="top"><!--[if gte mso 9]>
                                                                <table align='center' border='0' cellspacing='0' cellpadding='0' width='600'>
                                                                  <tr>
                                                                    <td align='center' valign='top'> <![endif]-->
<table style="min-width: 50%; border-collapse: collapse; mso-table-lspace: 0pt; max-width: 600px; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%" border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td>
<table>
<tr>
<td class="mob-padding-bottom-10" align="" width="600" style="color: #000000;padding-top: 5px;text-size-adjust: 100%; font-family: Arial, Helvetica, sans-serif;font-size: 16px; font-style: normal; font-weight: normal; line-height: 30px;" valign="top">
<span style="color: #000000;padding-bottom: 0px; font-weight: normal; " class="">
<span class="" style="">${emailContent2}</span><br>

</span>
</td>
</tr>
<tr>
<td class=" logo-width" style="width: 40%; background-color: #ffffff; " align="left">
<img src="https://static.cdn.responsys.net/i2/responsysimages/wix/contentlibrary/blast_generic/wix_logo_new_dark-mood_20102022.png" width="65" style="display: block">
</td>

</tr>
    <tr>
<td class="mob-padding-bottom-10" align="" width="600" style="color: #000000;padding-top: 5px;text-size-adjust: 100%; font-family: Arial, Helvetica, sans-serif;font-size: 16px; font-style: normal; font-weight: normal; line-height: 30px;" valign="top">
<span style="color: #000000;padding-bottom: 0px; font-weight: normal; " class="">
<span class="" style=""><strong>${firstLastName}</strong></span><br>
<span class="" style="color:#9194A1; font-size:14px;">${positionTitle}</span>
</span>
</td>
</tr>
</table>
</td>
</tr>
</table><!--[if gte mso 9>
                                                        </td>
                                                        </tr>
                                                        </table><![endif]-->
</td>
</tr>
</table>
</td>
</tr>
</table><!--[if gte mso 9>
                                                      </td>
                                                    </tr>
                                                  </table><![endif]-->
</div>
</td>
</tr>
</table><!--[if gte mso 9>
                                                        </td>
                                                        </tr>
                                                        </table><![endif]-->
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table><!--[if gte mso 9>
                                                        </td>
                                                        </tr>
                                                        </table><![endif]-->
</div>
</td>
</tr>
</tbody>
</table><!--[if gte mso 9>
                                                            </td>
                                                            </tr>
                                                            </table><![endif]-->
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>

<!-- FOOTER DROPDOWN START -->
<tr>
<td>
<tr>
<td class="" align="center" valign="top" width="100%" style="margin: 0px; background-color: #fff;"><!--[if gte mso 9]>
          <table align='center' border='0' cellspacing='0' cellpadding='0' width='800'>
            <tr>
              <td align='center' valign='top'>
          <![endif]-->
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff; border-collapse: collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%">
<tr>
<td class="container-padding-3" align="center" valign="top" style="padding-top: 0; padding-bottom: 0; mso-line-height-rule: exactly;padding: 0; margin: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;background-color: #fff">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 auto; max-width: 600px;border-collapse: collapse;mso-table-lspace: 0pt; mso-table-rspace: 0pt; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%">
<tbody>
<tr>
<td style="padding: 0px">
<table cellpadding="0" cellspacing="0" style="text-align: center; margin: 0 auto" width="100%" align="center"><!--[if !mso]>
                           <!-- -->
<tr>
<td>
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tr>
<td><!-- DO NOT DELETE TABLE BELOW -->
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="mobile-block container-padding-3" style="mso-hide: all; display: table!important;">
<tr>
<td class="mobile-block" width="100%" style="border-top: 1px solid #000000;"><!-- PLACE APP STORE BUTTONS BLOCK HERE -->
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table><!--<![endif]-->
</td>
</tr>
</tbody></table><!-- PROMOTIONAL FOOTER --><!-- SOCIAL HEADER -->

                      <!--[if gte mso 9>
                              </td>
                              </tr>
                              </table><![endif]-->
<table cellpadding="0" cellspacing="0" style="text-align: center; margin: 0 auto" align="center">
<tbody><!-- SOCIAL ICONS -->
<tr>
<td style="padding-top: 20px; padding-bottom:20px;">
<table cellpadding="0" cellspacing="0" style="text-align: center; margin: 0 auto" align="center">
<tbody>

                              
</tbody>
</table>
</td>
</tr>
                        </tbody>
                      </table>
                    <!--[if gte mso 9>
                </td>
                </tr>
                </table>
                <![endif]-->
</tbody></table><!-- PROMOTIONAL BLOG FOOTER --><!-- Acquisition FB Events PROMOTIONAL FOOTER --><!-- SEO PROMOTIONAL FOOTER --><!-- SEO NON WIX USERS PROMOTIONAL FOOTER --><!-- Bookings Promotional FOOTER --><!-- Day Ful FOOTER --><!-- PROMOTIONAL NON WIX USERS FOOTER --><!-- TRANSACTIONAL FOOTER --><!-- TRANSACTIONAL BlOG FOOTER --><!-- TRANSACTIONAL Acquisition FB Events --><!-- TRANSACTIONAL NON WIX USERS FOOTER -->


<!-- PAYMENTS FOOTER -->
</td>
</tr>
</table><!-- PAYMENTS FOOTER - with Reply -->
</td>
</tr>
</td></tr></tbody></table><!--[if gte mso 9>
                      </td>
                      </tr>
                      </table><![endif]-->
</td>
</tr>
</table><!-- FOOTER DROPDOWN END --><!--[if gte mso 9>
    </td>
    </tr>
    </table><![endif]-->




<!--[if gte mso 9>
</td>
</tr>
</table><![endif]-->
</center>
</div>
<br class="mob-break" style="display:none;" name="mobile_break">
</body>
</html>`
}