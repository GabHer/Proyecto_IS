import { Component, OnInit } from '@angular/core';
import { faMapMarkerAlt, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebookSquare, faLinkedin } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  faMapMarkerAlt = faMapMarkerAlt;
  faMobileAlt = faMobileAlt;
  faTwitter = faTwitter;
  faFacebookSquare = faFacebookSquare;
  faLinkedin = faLinkedin;

  constructor() { }

  ngOnInit(): void {
  }

}
