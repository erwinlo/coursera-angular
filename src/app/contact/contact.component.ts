import { Component, OnInit } from '@angular/core';
import { faPhone, faFax, faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  faPhone = faPhone;
  faFax = faFax;
  faEnvelope = faEnvelope;

  constructor() {}

  ngOnInit(): void {}
}
