import {Component} from 'react'
import './index.css'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {FaStar} from 'react-icons/fa'
import Header from '../Header'

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobsList: [],
    skillsList: [],
    isItemLoading: true,
    isItemErr: false,
  }

  componentDidMount() {
    this.getItemDetails()
  }

  getItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = {
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        id: fetchedData.job_details.id,
        jobDescription: fetchedData.job_details.job_description,
        skills: fetchedData.job_details.skills,
        description: fetchedData.job_details.life_at_company.description,
        imgUrl: fetchedData.job_details.life_at_company.image_url,
        location: fetchedData.job_details.location,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
        rating: fetchedData.job_details.rating,
        title: fetchedData.job_details.title,
      }

      const newSkillsList = updatedData.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))

      const updatedSimilarJobs = fetchedData.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobData: updatedData,
        skillsList: newSkillsList,
        similarJobsList: updatedSimilarJobs,
        isItemLoading: false,
        isItemErr: false,
      })
    } else {
      this.setState({
        isItemLoading: false,
        isItemErr: true,
      })
    }
  }

  onclickRetry = () => {
    this.setState(
      {
        jobData: {},
        similarJobsList: [],
        skillsList: [],
        isItemLoading: true,
        isItemErr: false,
      },
      this.getItemDetails,
    )
  }

  renderItem = () => {
    const {jobData, similarJobsList, skillsList, isItemLoading, isItemErr} =
      this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      description,
      imgUrl,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobData

    if (isItemLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }
    if (isItemErr) {
      return (
        <div className="not-found-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="not-found-img"
          />
          <h1 className="home-heading">Oops! Something Went Wrong</h1>
          <p className="home-description">
            We cannot seem to find the page you are looking for
          </p>
          <button type="button" onClick={this.onclickRetry}>
            Retry
          </button>
        </div>
      )
    }

    return (
      <div>
        <div className="job-details job-item-container">
          <div className="top-details">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-img"
            />
            <div className="top-right-details">
              <h1 className="job-role">{title}</h1>
              <div className="rating-container">
                <button
                  type="button"
                  aria-label="Favorite"
                  className="rating-button"
                >
                  <FaStar className="star-icon" />
                </button>
                <p className="rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <div className="middle-details">
            <div className="middle-left-container">
              <div className="ele-holder">
                <p className="location-text">{location}</p>
              </div>
              <div className="ele-holder">
                <p className="location-text">{employmentType}</p>
              </div>
            </div>
            <p className="package-text">{packagePerAnnum}</p>
          </div>
          <div className="middle-details des">
            <h1 className="job-description">Description</h1>
            <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
              Visit
            </a>
          </div>
          <p className="job-description-text">{jobDescription}</p>
          <h1 className="job-description">Skills</h1>
          <ul className="skills-list">
            {skillsList.map(each => (
              <li className="skill">
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skil-image"
                />
                <p className="job-description-text">{each.name}</p>
              </li>
            ))}
          </ul>

          <h1 className="job-description">Life at Company</h1>
          <div className="life-at-company">
            <p className="job-description-text">{description}</p>
            <img src={imgUrl} alt="" className="company-image" />
          </div>
        </div>
        <div>
          <h1 className="job-role">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobsList.map(each => (
              <li key={each.id} className="similar-details">
                <div className="top-details">
                  <img
                    src={each.companyLogoUrl}
                    alt="similar job company logo"
                    className="company-img"
                  />
                  <div className="top-right-details">
                    <h1 className="job-role">{each.title}</h1>
                    <div className="rating-container">
                      <button
                        type="button"
                        aria-label="Favorite"
                        className="rating-button"
                      >
                        <FaStar className="star-icon" />
                      </button>
                      <p className="rating-text">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="job-description">Description</h1>
                <p className="job-description-text">{each.jobDescription}</p>
                <div className="middle-left-container">
                  <div className="ele-holder">
                    <p className="location-text">{each.location}</p>
                  </div>
                  <div className="ele-holder">
                    <p className="location-text">{each.employmentType}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="item-container">{this.renderItem()}</div>
      </>
    )
  }
}

export default JobItemDetails
