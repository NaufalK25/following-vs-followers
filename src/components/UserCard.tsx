import { FC } from "react"
import { User } from "../type"

type UserCardProps = {
    data: User,
    btnText: string
}

const UserCard: FC<UserCardProps> = ({ data, btnText }) => {
    return <div className="group">
        <div className="flex items-center justify-between">
            <div>
                <img className="rounded-full w-12 h-12 transition-transform duration-300 group-hover:scale-110" src={data.avatar_url} alt={data.login} />
            </div>
            <div>
                <p className="text-github-text-secondary group-hover:text-github-text-primary text-lg" title={data.login}>{data.login}</p>
            </div>
            <div>
                <a
                    className="p-2 bg-github-card border border-solid border-github-border-primary rounded-lg text-github-text-primary text-xs font-semibold"
                    href={data.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {btnText}
                </a>
            </div>
        </div>
        <hr className="mt-5  border-github-border-primary" />
    </div>
}

export default UserCard;