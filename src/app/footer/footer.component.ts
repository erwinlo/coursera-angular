import { Component, OnInit } from '@angular/core';
import {
  faFacebookF,
  faGooglePlusG,
  faLinkedinIn,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faPhone, faFax } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  faFacebook = faFacebookF;
  faGooglePlus = faGooglePlusG;
  faLinkedIn = faLinkedinIn;
  faTwitter = faTwitter;
  faYoutube = faYoutube;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faFax = faFax;

  constructor() {}

  ngOnInit(): void {}
}
